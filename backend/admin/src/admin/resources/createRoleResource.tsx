import { ResourceOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { isSuperuser } from '../auth-provider.js';
import { prisma } from '../db.js';

export const createRoleResource = () => {
  return {
    resource: { model: getModelByName('role'), client: prisma },
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
        delete: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        bulkDelete: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        list: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        show: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
        search: { isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin) },
      },
    } as ResourceOptions,
  };
};
