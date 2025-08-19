import { ResourceOptions } from 'adminjs';
import { navigation } from '../options.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { getModelByName } from '@adminjs/prisma';

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
      },
    } as ResourceOptions,
  };
};
