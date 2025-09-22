import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ResourceOptions,
  UploadedFile,
  ValidationError,
} from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { componentLoader, SchemeUpload } from '../component-loader.js';
import path from 'path';
import fs from 'fs';
import uploadFeature from '@adminjs/upload';
import unzipper from 'unzipper';
import getFolderSize from 'get-folder-size';
import { ViralSchemeValidator } from '../strategies/ViralSchemeValidator.js';
import { BacterialSchemeValidator } from '../strategies/BacterialSchemeValidator.js';
import { prisma } from '../db.js';

const fillSchemeSizesFromDirectories = async (response: ActionResponse) => {
  if (!response.record && !response.records) {
    return response;
  }
  for (const record of response.records ?? [response.record]) {
    const size = await getFolderSize.strict(
      path.join('../modules/sequence_analysis/schemes', record.params.id.toString())
    );
    record.params.scheme_size = `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
  return response;
};

const extractSchemeUpload = async (request: ActionRequest, record: BaseRecord) => {
  if (record && request.payload?.scheme_upload) {
    const file = request.payload?.scheme_upload;
    // create folder using record id
    const folderName = record.params.id.toString();
    const extractPath = path.join('../modules/sequence_analysis/schemes', folderName);
    if (fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString()))) {
      await fs.promises.rmdir(extractPath, { recursive: true });
    }
    await fs.promises.mkdir(extractPath, { recursive: true });
    // extract ZIP into folder named after record id
    await fs
      .createReadStream(file.path)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();
    await record.update({
      scheme_version: new Date(),
    });
  }
};

const deleteSchemeDirectory = async (record: BaseRecord) => {
  const folderName = record.params.id.toString();
  const extractPath = path.join('../modules/sequence_analysis/schemes', folderName);
  if (fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString()))) {
    await fs.promises.rmdir(extractPath, { recursive: true });
  }
};

const validateSchemeUpload = async (file: UploadedFile, type: string, record?: BaseRecord) => {
  if (!file) {
    if (
      record &&
      record.params &&
      fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString()))
    ) {
      return null;
    }
    throw new ValidationError(
      { scheme_upload: { message: 'Scheme upload must be provided.' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new ValidationError(
      { scheme_upload: { message: 'Uploaded file is too large (max. 50 MB).' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  if (file) {
    // extend by zip-compressed, x-zip-compressed?
    if (file.type !== 'application/zip') {
      throw new ValidationError(
        { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
        { message: 'Scheme upload is invalid' }
      );
    }
  }
  const validator = type === 'viral' ? new ViralSchemeValidator(file) : new BacterialSchemeValidator(file);
  validator.validateUpload();
  return validator.getValidatedZip();
};

export const createPathogenResource = () => {
  return {
    resource: { model: getModelByName('pathogen'), client: prisma },
    options: {
      navigation: null,
      listProperties: [
        'id',
        'name',
        'type',
        'genetic_distance_threshold',
        'scheme_version',
        'scheme_size',
        'example_file',
      ],
      properties: {
        activated: {
          type: 'boolean',
          position: 1,
        },
        name: {
          type: 'string',
          description: 'Representation of the pathogen within the GENTRAIN dashboard.',
          position: 2,
        },
        type: {
          availableValues: [
            { value: 'bacterial', label: 'Bacterial' },
            { value: 'viral', label: 'Viral' },
          ],
          description: 'Defines how genomic sequences are analyzed. Can not be changed after first pathogen creation.',
          position: 3,
          components: {
            edit: 'SchemeTypeSelectEdit',
          },
        },
        genetic_distance_threshold: {
          type: 'number',
          description:
            'Genetic distances below this threshold are be considered as similar or almost similar genomic sequences.',
          position: 4,
        },
        scheme_size: {
          type: 'string',
          isVisible: { list: true, show: true, edit: false, filter: false },
          isVirtual: true,
        },
        scheme_version: {
          isVisible: { list: true, show: true, edit: false, filter: false },
        },
        scheme_upload: {
          type: 'mixed',
          isRequired: true,
          description: 'Used to extract mutation information of genomic sequences.',
          isVisible: { list: false, show: false, edit: true, filter: false },
          custom: {
            label: 'Scheme Upload',
          },
          components: {
            edit: SchemeUpload,
          },
        },
        example_cases_key: { isVisible: false },
        example_cases_size: { isVisible: false },
        example_cases_bucket: { isVisible: false },
        example_sequences_key: { isVisible: false },
        example_sequences_size: { isVisible: false },
        example_sequences_bucket: { isVisible: false },
        example_contacts_key: { isVisible: false },
        example_contacts_size: { isVisible: false },
        example_contacts_bucket: { isVisible: false },
      },
      actions: {
        list: {
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // Retrieve size of scheme directory to present in show view
            response = fillSchemeSizesFromDirectories(response);
            return response;
          },
        },
        show: {
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // Retrieve size of scheme directory to present in show view
            response = fillSchemeSizesFromDirectories(response);
            return response;
          },
        },
        new: {
          before: async (request: ActionRequest, context: ActionContext) => {
            // Validate zip upload before extraction to scheme directory
            if (request.method === 'post') {
              request.payload.scheme_upload = await validateSchemeUpload(
                request.payload.scheme_upload,
                request.payload.type
              );
            }
            return request;
          },
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // Extract validated zip upload to scheme directory
            if (request.method === 'post') {
              extractSchemeUpload(request, context.record);
            }
            return response;
          },
        },
        edit: {
          before: async (request: ActionRequest, context: ActionContext) => {
            // Validate zip upload before extraction to scheme directory
            if (request.method === 'post') {
              request.payload.scheme_upload = await validateSchemeUpload(
                request.payload.scheme_upload,
                request.payload.type,
                context.record
              );
            }
            return request;
          },
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            const { record } = context;
            // retrieve size of scheme directory to present in edit view
            if (request.method === 'get') {
              if (fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString()))) {
                response = fillSchemeSizesFromDirectories(response);
              }
            }
            // extract validated zip upload to scheme directory
            if (request.method === 'post') {
              extractSchemeUpload(request, record);
            }
            return response;
          },
        },
        delete: {
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // delete corresponding scheme directory and content recursively on pathogen deletion
            deleteSchemeDirectory(context.record);
            return response;
          },
        },
      },
    } as ResourceOptions,
    features: [
      uploadFeature({
        componentLoader,
        provider: {
          local: {
            bucket: 'public/example_cases',
            opts: {
              baseUrl: '/example_cases',
            },
          },
        },
        properties: {
          key: 'example_cases_key',
          file: 'example_cases_file',
          filePath: 'file_path_example_cases',
          filesToDelete: 'files_to_delete_example_cases',
          bucket: 'example_cases_bucket',
          size: 'example_cases_size',
        },
        validation: {
          maxSize: 5 * 1024 * 1024,
          mimeTypes: ['text/csv'],
        },
      }),
      uploadFeature({
        componentLoader,
        provider: {
          local: {
            bucket: 'public/example_sequences',
            opts: {
              baseUrl: '/example_sequences',
            },
          },
        },
        properties: {
          key: 'example_sequences_key',
          file: 'example_sequences_file',
          filePath: 'file_path_example_sequences',
          filesToDelete: 'files_to_delete_example_sequences',
          bucket: 'example_sequences_bucket',
          size: 'example_sequences_size',
        },
        validation: {
          maxSize: 5 * 1024 * 1024,
        },
      }),
      uploadFeature({
        componentLoader,
        provider: {
          local: {
            bucket: 'public/example_contacts',
            opts: {
              baseUrl: '/example_contacts',
            },
          },
        },
        properties: {
          key: 'example_contacts_key',
          file: 'example_contacts_file',
          filePath: 'file_path_example_contacts',
          filesToDelete: 'files_to_delete_example_contacts',
          bucket: 'example_contacts_bucket',
          size: 'example_contacts_size',
        },
        validation: {
          maxSize: 5 * 1024 * 1024,
          mimeTypes: ['text/csv'],
        },
      }),
    ],
  };
};
