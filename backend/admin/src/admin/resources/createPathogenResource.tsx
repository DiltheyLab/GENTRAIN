import { ResourceOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import {
  componentLoader,
  ErrorMessage,
  ExampleDataDownloadShow,
  SchemeDownloadList,
  SchemeDownloadShow,
  SchemeTypeSelectEdit,
  SchemeUpload,
} from '../component-loader.js';
import uploadFeature from '@adminjs/upload';
import { prisma } from '../db.js';
import loggerFeature from '@adminjs/logger';
import { handleSchemeExtraction } from '../hooks/handleSchemeExtraction.js';
import preprocessSchemeExtraction from '../hooks/preprocessSchemeExtraction.js';
import deleteSchemeDirectory from '../hooks/deleteSchemeDirectory.js';
import validateExampleDataUploads from '../hooks/validateExampleDataUploads.js';
import { initValidationErrors } from '../hooks/initValidationErrors.js';
import { throwValidationErrors } from '../hooks/throwValidationErrors.js';
import { readableSchemeSize } from '../hooks/readableSchemeSize.js';
import { sanitizeFileName } from '../util/helpers.js';
import UploadProvider from '../upload-provider.js';

export const createPathogenResource = () => {
  return {
    resource: { model: getModelByName('pathogen'), client: prisma },
    options: {
      navigation: null,
      properties: {
        name: {
          type: 'string',
          description: 'Representation of the pathogen within the GENTRAIN dashboard.',
          position: 1,
        },
        type: {
          availableValues: [
            { value: 'bacterial', label: 'Bacterial' },
            { value: 'viral', label: 'Viral' },
          ],
          description: 'Defines how genomic sequences are analyzed. Can not be changed after first pathogen creation.',
          position: 2,
          components: {
            edit: SchemeTypeSelectEdit,
          },
        },
        genetic_distance_threshold: {
          type: 'number',
          description:
            'Genetic distances below this threshold are be considered as similar or almost similar genomic sequences.',
          position: 3,
        },
        activated: {
          type: 'boolean',
          position: 4,
        },
        scheme_version: {
          isVisible: { list: true, show: false, edit: false, filter: false },
          position: 5,
        },
        scheme_size: {
          isVisible: { list: true, show: false, edit: false, filter: false },
          isVirtual: true,
          position: 6,
        },
        scheme: {
          position: 7,
          type: 'mixed',
          isRequired: true,
          description: 'Used to extract mutation information of genomic sequences.',
          isVisible: { list: false, show: false, edit: true, filter: false },
          components: {
            edit: SchemeUpload,
          },
        },
        scheme_download: {
          position: 8,
          isVisible: { list: true, show: true, edit: false, filter: false },
          components: {
            show: SchemeDownloadShow,
            list: SchemeDownloadList,
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
        example_cases_file: {
          isVisible: { list: false, filter: false, show: true, edit: true },
          position: 9,
          components: {
            show: ExampleDataDownloadShow,
          },
          custom: { type: 'case', filename: 'falldaten', key: 'example_cases_key' },
        },
        // Custom error handling component that only display an error message.
        // Mainly used since the upload component does not handle error messages.
        example_cases_errors: {
          isVisible: { list: false, filter: false, show: false, edit: true },
          position: 10,
          components: {
            edit: ErrorMessage,
          },
        },
        example_sequences_file: {
          isVisible: { list: false, filter: false, show: true, edit: true },
          position: 11,
          components: {
            show: ExampleDataDownloadShow,
          },
          custom: { type: 'sequence', filename: 'sequenzdaten', key: 'example_sequences_key' },
        },
        // Custom error handling component that only display an error message.
        // Mainly used since the upload component does not handle error messages.
        example_sequences_errors: {
          isVisible: { list: false, filter: false, show: false, edit: true },
          position: 12,
          components: {
            edit: ErrorMessage,
          },
        },
        example_contacts_file: {
          isVisible: { list: false, filter: false, show: true, edit: true },
          position: 13,
          components: {
            show: ExampleDataDownloadShow,
          },
          custom: { type: 'contact', filename: 'kontaktdaten', key: 'example_contacts_key' },
        },
        // Custom error handling component that only display an error message.
        // Mainly used since the upload component does not handle error messages.
        example_contacts_errors: {
          isVisible: { list: false, filter: false, show: false, edit: true },
          position: 14,
          components: {
            edit: ErrorMessage,
          },
        },
      },
      actions: {
        list: { after: [readableSchemeSize] },
        show: { after: [] },
        new: {
          before: [initValidationErrors, preprocessSchemeExtraction, validateExampleDataUploads, throwValidationErrors],
          after: [handleSchemeExtraction],
        },
        edit: {
          before: [
            initValidationErrors,
            readableSchemeSize,
            preprocessSchemeExtraction,
            validateExampleDataUploads,
            throwValidationErrors,
          ],
          after: [handleSchemeExtraction],
        },
        delete: {
          after: [deleteSchemeDirectory],
        },
        bulkDelete: {
          after: [deleteSchemeDirectory],
        },
      },
    } as ResourceOptions,
    features: [
      uploadFeature({
        componentLoader,
        provider: new UploadProvider('pathogen_example_data'),
        properties: {
          key: 'example_cases_key',
          file: 'example_cases_file',
          filePath: 'file_path_example_cases',
          filesToDelete: 'files_to_delete_example_cases',
          bucket: 'example_cases_bucket',
          size: 'example_cases_size',
        },
        validation: {
          maxSize: 100 * 1024 * 1024,
        },
        uploadPath: (record, _filename) => {
          return `${record.params.id}/${sanitizeFileName(record.params.name)}_falldaten.csv`;
        },
      }),
      uploadFeature({
        componentLoader,
        provider: new UploadProvider('pathogen_example_data'),
        properties: {
          key: 'example_sequences_key',
          file: 'example_sequences_file',
          filePath: 'file_path_example_sequences',
          filesToDelete: 'files_to_delete_example_sequences',
          bucket: 'example_sequences_bucket',
          size: 'example_sequences_size',
          filename: 'sequenzdaten.fasta',
        },
        validation: {
          maxSize: 100 * 1024 * 1024,
        },
        uploadPath: (record, filename) => {
          return `${record.params.id}/${sanitizeFileName(record.params.name)}_sequenzdaten.${filename.split('.')[1]}`;
        },
      }),
      uploadFeature({
        componentLoader,
        provider: new UploadProvider('pathogen_example_data'),
        properties: {
          key: 'example_contacts_key',
          file: 'example_contacts_file',
          filePath: 'file_path_example_contacts',
          filesToDelete: 'files_to_delete_example_contacts',
          bucket: 'example_contacts_bucket',
          size: 'example_contacts_size',
        },
        validation: {
          maxSize: 100 * 1024 * 1024,
        },
        uploadPath: (record, _filename) => {
          return `${record.params.id}/${sanitizeFileName(record.params.name)}_kontaktdaten.csv`;
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
