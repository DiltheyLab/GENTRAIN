import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  BaseRecord,
  ResourceOptions,
  UploadedFile,
  ValidationError,
} from 'adminjs';
import { navigation } from '../options.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { getModelByName } from '@adminjs/prisma';
import { componentLoader, SchemeUpload } from '../component-loader.js';
import path from 'path';
import fs from 'fs';
import uploadFeature from '@adminjs/upload';
import unzipper from 'unzipper';
import getFolderSize from 'get-folder-size';

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

const validateSchemeUpload = async (file: UploadedFile, record?: BaseRecord) => {
  if (
    !file &&
    (!record || !fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString())))
  ) {
    throw new ValidationError(
      { scheme_upload: { message: 'Scheme upload must be provided.' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  if (file) {
    if (file.type !== 'application/zip') {
      throw new ValidationError(
        { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
        { message: 'Scheme upload is invalid' }
      );
    }
    try {
      const zip = await unzipper.Open.file(file.path);

      if (!zip.files || zip.files.length === 0) {
        throw new ValidationError(
          { scheme_upload: { message: 'Uploaded ZIP archive is empty.' } },
          { message: 'Scheme upload is invalid' }
        );
      }
    } catch (err) {
      throw new ValidationError(
        { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
        { message: 'Scheme upload is invalid' }
      );
    }
  }
};

export const createPathogenResource = (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  return {
    resource: { model: getModelByName('pathogen'), client: prisma },
    options: {
      navigation: navigation,
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
          position: 2,
        },
        type: {
          availableValues: [
            { value: 'bacterial', label: 'Bacterial' },
            { value: 'viral', label: 'Viral' },
          ],
          position: 3,
        },
        genetic_distance_threshold: {
          type: 'number',
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
          isVisible: { list: false, show: false, edit: true, filter: false },
          custom: {
            label: 'Scheme Upload',
          },
          components: {
            edit: SchemeUpload,
          },
        },
        example_data_key: { isVisible: false },
        example_data_size: { isVisible: false },
        example_data_bucket: { isVisible: false },
      },
      actions: {
        list: {
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // retrieve size of scheme directory to present in show view
            response = fillSchemeSizesFromDirectories(response);
            return response;
          },
        },
        show: {
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // retrieve size of scheme directory to present in show view
            response = fillSchemeSizesFromDirectories(response);
            return response;
          },
        },
        new: {
          before: async (request: ActionRequest, context: ActionContext) => {
            // validate zip upload before extraction to scheme directory
            if (request.method === 'post') {
              await validateSchemeUpload(request.payload.scheme_upload);
            }
            return request;
          },
          after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
            // extract validated zip upload to scheme directory
            if (request.method === 'post') {
              extractSchemeUpload(request, context.record);
            }
            return response;
          },
        },
        edit: {
          before: async (request: ActionRequest, context: ActionContext) => {
            // validate zip upload before extraction to scheme directory
            if (request.method === 'post') {
              await validateSchemeUpload(request.payload.scheme_upload, context.record);
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
            bucket: 'public/example_data',
            opts: {
              baseUrl: '/example_data',
            },
          },
        },
        properties: {
          key: 'example_data_key',
          file: 'example_file',
          filePath: 'file_path_example_data_upload',
          filesToDelete: 'files_to_delete_example_data_upload',
          bucket: 'example_data_bucket',
          size: 'example_data_size',
        },
        validation: {
          mimeTypes: ['application/zip'],
        },
      }),
    ],
  };
};
