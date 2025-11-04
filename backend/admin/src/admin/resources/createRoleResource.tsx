import { NotFoundError, ResourceOptions, ValidationError } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { isSuperuser } from '../auth-provider.js';
import { prisma } from '../db.js';
import loggerFeature from '@adminjs/logger';
import { componentLoader } from '../component-loader.js';

export const createRoleResource = () => {
  return {
    resource: { model: getModelByName('role'), client: prisma },
    features: [
      loggerFeature({
        componentLoader,
        propertiesMapping: {
          user: 'userId',
        },
        userIdAttribute: 'id',
      }),
    ],
    options: {
      navigation: null,
      properties: {
        name: {
          isRequired: true,
          type: 'string',
        },
      },
      actions: {
        new: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        edit: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        delete: {
          handler: async (request, _response, context) => {
            const { record, resource, currentAdmin, h } = context;

            if (!request.params.recordId || !record) {
              throw new NotFoundError(['You have to pass "recordId" to Delete Action'].join('\n'), 'Action#handler');
            }

            if (request.method === 'get') {
              return {
                record: record.toJSON(context.currentAdmin),
              };
            }

            try {
              await resource.delete(request.params.recordId, context);
            } catch (error) {
              if (error instanceof ValidationError) {
                const baseMessage = error.baseError?.message || 'thereWereValidationErrors';
                return {
                  record: record.toJSON(currentAdmin),
                  notice: {
                    message: baseMessage,
                    type: 'error',
                  },
                };
              }
              if (
                error.code === 'P2003' // Prisma FK constraint error
              ) {
                const baseMessage = 'This role cannot be deleted as there are still users associated with it.';
                return {
                  record: record.toJSON(currentAdmin),
                  notice: {
                    message: baseMessage,
                    type: 'error',
                  },
                };
              }
              throw error;
            }

            return {
              record: record.toJSON(currentAdmin),
              redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
              notice: {
                message: 'successfullyDeleted',
                type: 'success',
              },
            };
          },
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
        },
        bulkDelete: { isAccessible: false },
        list: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        show: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        search: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
      },
    } as ResourceOptions,
  };
};
