import { ResourceOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { isCurrentUser, isSuperuser } from '../auth-provider.js';
import { sanitizeUserResponse } from '../hooks/sanitizeUserResponse.js';
import { prisma } from '../db.js';
import loggerFeature from '@adminjs/logger';
import { componentLoader } from '../component-loader.js';
import { validateUser } from '../hooks/validateUser.js';

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
          before: [validateUser],
        },
        show: {
          isAccessible: ({ currentAdmin, record }) => isSuperuser(currentAdmin) || isCurrentUser(currentAdmin, record),
          after: [sanitizeUserResponse],
        },
        edit: {
          isAccessible: ({ currentAdmin, record }) => isSuperuser(currentAdmin) || isCurrentUser(currentAdmin, record),
          before: [validateUser],
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
