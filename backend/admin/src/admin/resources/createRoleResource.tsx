import { ResourceOptions } from 'adminjs';
import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

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
        permissions: {
          isArray: true,
          type: 'string',
          availableValues: [
            { value: 'read', label: 'Read' },
            { value: 'write', label: 'Write' },
            { value: 'delete', label: 'Delete' },
          ],
        },
      },
    } as ResourceOptions,
  };
};
