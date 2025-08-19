import { ResourceOptions } from 'adminjs';
import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export const createUserResource = (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  return {
    resource: { model: getModelByName('user'), client: prisma },
    options: {
      navigation: navigation, // Add resource to navigation
      properties: {
        email: {
          isRequired: true,
          type: 'string',
        },
        password: {
          isRequired: true,
          type: 'password',
          isVisible: { list: false, filter: false, show: false, edit: true },
        },
      },
    } as ResourceOptions,
  };
};
