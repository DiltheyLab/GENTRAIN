import { ActionContext, ActionRequest, PropertyOptions, ResourceOptions, ValidationError } from 'adminjs';
import { navigation } from '../options.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { getModelByName } from '@adminjs/prisma';
import { componentLoader, FileUpload } from '../component-loader.js';
import uploadFeature from '@adminjs/upload';

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
  console.log('Payload', request.payload);

  const customRequest = request as CustomActionRequest;
  console.log('Custom Request:', customRequest);

  const uploadedScheme = customRequest.files && customRequest.files['scheme_file.0'];
  // We only want to validate "post" requests
  if (customRequest.method !== 'post') return request;

  if (!uploadedScheme) {
    throw new ValidationError({
      scheme_name: {
        message: 'Eine Datei muss hochgeladen werden.',
      },
    });
  }

  const maxSizeBytes = 20 * 1024 * 1024 * 1024;
  if (uploadedScheme.size > maxSizeBytes) {
    throw new ValidationError({
      scheme_name: {
        message: 'Die Datei ist zu groß (max. 20 GB).',
      },
    });
  }

  if (!uploadedScheme.name.endsWith('.pdf')) {
    throw new ValidationError({
      scheme_name: {
        message: 'Nur PDF-Dateien sind erlaubt.',
      },
    });
  }

  return request;
};

export const createPathogenResource = (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  return {
    resource: { model: getModelByName('pathogen'), client: prisma },
    options: {
      navigation: navigation,

      properties: {
        type: {
          availableValues: [
            { value: 'bacterial', label: 'Bacterial' },
            { value: 'viral', label: 'Viral' },
          ],
        },
        genetic_distance_threshold: {
          type: 'number',
        },
        /*         cases_example_data: {
          components: {
            edit: FileUpload,
            show: FileUpload,
          },
        }, */
        scheme_name: {
          type: 'string',
          isRequired: true,
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
          key: 'scheme_name',
          file: 'scheme_file',
        },

        validation: {
          //20 gb in bytes
          maxSize: 20000000000,
        },
      }),
    ],
  };
};
