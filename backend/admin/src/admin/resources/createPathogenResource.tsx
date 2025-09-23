import { ResourceOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { componentLoader, SchemeUpload } from '../component-loader.js';
import uploadFeature from '@adminjs/upload';
import { prisma } from '../db.js';
import loggerFeature from '@adminjs/logger';
import { handleSchemeExtraction } from '../hooks/handleSchemeExtraction.js';
import preprocessSchemeExtraction from '../hooks/preprocessSchemeExtraction.js';
import { fillSchemeSizesFromDirectories } from '../hooks/fillSchemeSizeFromDIrectories.js';
import deleteSchemeDirectory from '../hooks/deleteSchemeDirectory.js';

export const createPathogenResource = () => {
  return {
    resource: { model: getModelByName('pathogen'), client: prisma },
    options: {
      navigation: null,
      listProperties: ['id', 'name', 'type', 'genetic_distance_threshold', 'scheme_version', 'scheme_size'],
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
          after: [fillSchemeSizesFromDirectories],
        },
        show: {
          after: [fillSchemeSizesFromDirectories],
        },
        new: {
          before: [preprocessSchemeExtraction],
          after: [handleSchemeExtraction],
        },
        edit: {
          before: [preprocessSchemeExtraction],
          after: [handleSchemeExtraction],
        },
        delete: {
          after: [deleteSchemeDirectory],
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
      loggerFeature({
        componentLoader,
        propertiesMapping: {
          user: 'userId',
        },
        userIdAttribute: 'id',
      }),
    ],
  };
};
