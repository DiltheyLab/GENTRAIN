import { ActionResponse, After, ListActionResponse, RecordActionResponse, ResourceOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { hash } from 'argon2';
import { isSuperuser } from '../auth-provider.js';
import { sanitizeUserResponse } from '../hooks/sanitizeUserResponse.js';
import { isPOSTMethod } from '../admin.utils.js';
import { prisma } from '../db.js';
import loggerFeature from '@adminjs/logger';
import { componentLoader } from '../component-loader.js';

export const createUserResource = () => {
  return {
    resource: { model: getModelByName('user'), client: prisma },
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
        id: {
          position: 0,
          isVisible: {
            list: true,
            edit: false,
            filter: true,
            show: true,
          },
        },
        username: {
          isRequired: true,
          type: 'string',
          isTitle: true,
          position: 1,
        },
        role: {
          isRequired: true,
          type: 'reference',
        },
        password: {
          isRequired: true,
          type: 'password',
          isVisible: { list: false, filter: false, show: false, edit: true },
        },
        confirmed_at: {
          isVisible: {
            list: true,
            filter: true,
            show: true,
            edit: false,
          },
        },
        created_at: {
          isVisible: {
            list: true,
            filter: true,
            show: true,
            edit: false,
          },
        },
        updated_at: {
          isVisible: {
            list: true,
            filter: true,
            show: true,
            edit: false,
          },
        },
      },
      actions: {
        new: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          before: async (request) => {
            // hash password before saving
            if (request.payload?.password) {
              request.payload.password = await hash(request.payload.password);
            }
            return request;
          },
        },
        show: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeUserResponse],
        },
        edit: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          before: async (request) => {
            // no need to hash password on GET requests, it will be removed there anyway
            if (isPOSTMethod(request)) {
              // hash only if password is present, delete otherwise so it will not overwrite existing password with empty string
              if (request.payload?.password) {
                request.payload.password = await hash(request.payload.password);
              } else {
                delete request.payload?.password;
              }
              request.payload.updated_at = new Date();
            }
            return request;
          },
          after: [sanitizeUserResponse],
        },
        delete: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeUserResponse],
        },
        bulkDelete: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeUserResponse],
        },
        search: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeUserResponse],
        },
        list: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeUserResponse],
        },
      },
    } as ResourceOptions,
  };
};
