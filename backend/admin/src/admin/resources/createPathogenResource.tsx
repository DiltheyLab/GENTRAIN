import { ActionContext, ActionRequest, PropertyOptions, ResourceOptions, ValidationError } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { componentLoader, FileUpload } from '../component-loader.js';
import uploadFeature from '@adminjs/upload';
import { prisma } from '../db.js';

interface CustomActionRequest extends ActionRequest {
  files: {
    [key: string]: {
      name: string;
      path: string;
      size: number;
      type: string;
      extension: string;
    };
  };
}

const validateScheme = (request: ActionRequest, context: ActionContext) => {
  const customRequest = request as CustomActionRequest;

  const uploadedScheme = customRequest.files && customRequest.files['scheme_file.0'];
  // We only want to validate "post" requests
  if (customRequest.method !== 'post') return request;

  if (!uploadedScheme) {
    throw new ValidationError({
      scheme_file: {
        message: 'Ein Schema muss hochgeladen werden.',
      },
    });
  }

  const maxSizeBytes = 20 * 1024 * 1024 * 1024;
  if (uploadedScheme.size > maxSizeBytes) {
    throw new ValidationError({
      scheme_file: {
        message: 'Die Datei ist zu groß (max. 20 GB).',
      },
    });
  }

  if (!uploadedScheme.name.endsWith('.zip')) {
    throw new ValidationError({
      scheme_file: {
        message: 'Nur ZIP-Dateien sind erlaubt.',
      },
    });
  }

  return request;
};

export const createPathogenResource = () => {
  return {
    resource: { model: getModelByName('pathogen'), client: prisma },
    options: {
      navigation: null,
      properties: {
        type: {
          availableValues: [
            { value: 'bacterial', label: 'Bacterial' },
            { value: 'viral', label: 'Viral' },
          ],
          position: 1,
        },
        genetic_distance_threshold: {
          type: 'number',
          position: 2,
        },

        scheme_name: {
          position: 3,
          type: 'string',
        },
        scheme_key: { isVisible: false },
        scheme_file_path: { isVisible: false },
        scheme_size: { isVisible: false },
        scheme_bucket: { isVisible: false },
        scheme_files_to_delete: { isVisible: false },
        scheme_mime_type: { isVisible: false },
        cases_example_data_key: { isVisible: false },
        cases_example_data_file_path: { isVisible: false },
        cases_example_data_size: { isVisible: false },
        cases_example_data_bucket: { isVisible: false },
        cases_exmaple_data_file_name: { isVisible: false },
        cases_example_data_files_to_delete: { isVisible: false },
        cases_exmaple_data_mime_type: { isVisible: false },
        scheme_file: {
          isVisible: { list: false, filter: false, show: true, edit: true },
          label: 'Scheme (PDF, max. 20GB)',
          type: 'mixed',
          isRequired: true,
          position: 4,
        } as PropertyOptions,

        cases_example_file: {
          type: 'mixed',
          isVisible: { list: false, filter: false, show: true, edit: true },
          label: 'Example Case Data (CSV, max. 5 MB)',
          position: 5,
        } as PropertyOptions,
      },
      actions: {
        new: { before: [validateScheme] },
        edit: { before: [validateScheme] },
      },
    } as ResourceOptions,
    features: [
      uploadFeature({
        componentLoader,
        provider: {
          local: {
            bucket: 'public/schemes',
            opts: {
              baseUrl: '/schemes',
            },
          },
        },

        properties: {
          key: 'scheme_key',
          file: 'scheme_file',
          filePath: 'scheme_file_path',
          filename: 'scheme_file_name',
          bucket: 'scheme_bucket',
          filesToDelete: 'scheme_files_to_delete',
          mimeType: 'scheme_mime_type',
          size: 'scheme_size',
        },
        validation: {
          //20 gb in bytes
          maxSize: 20000000000,
          mimeTypes: ['application/zip', 'application/zip-compressed', 'application/x-zip-compressed'],
        },
      }),
      // Neue Konfiguration für 'cases_example_data'
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
          key: 'cases_example_data_key',
          file: 'cases_example_file',
          filePath: 'cases_example_data_file_path',
          bucket: 'cases_example_data_bucket',
          filename: 'cases_example_data_file_name',
          filesToDelete: 'cases_example_data_files_to_delete',
          size: 'cases_example_data_size',
          mimeType: 'cases_example_data_mime_type',
        },
        validation: {
          maxSize: 5 * 1024 * 1024, // 5 MB
          mimeTypes: ['text/csv'],
        },
      }),
    ],
  };
};
