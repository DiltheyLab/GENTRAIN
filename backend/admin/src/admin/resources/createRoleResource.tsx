import { ResourceOptions } from 'adminjs';
import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { isSuperuser } from '../auth-provider.js';

export const createRoleResource = (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  return {
    resource: { model: getModelByName('role'), client: prisma },
    options: {
      navigation: navigation,
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
