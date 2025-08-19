import { AdminJSOptions } from 'adminjs';
import { componentLoader, DASHBOARD } from './component-loader.js';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { createUserResource } from './resources/createUserResource.js';
import { createPathogenResource } from './resources/createPathogenResource.js';
import { createRoleResource } from './resources/createRoleResource.js';

export const navigation = {
  name: 'Postgres DB',
  icon: 'Database',
};

export const createAdminJsOptions = (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
): AdminJSOptions => {
  const options = {
    rootPath: '/admin',
    dashboard: {
      component: DASHBOARD,
    },
    branding: {
      companyName: 'GENTRAIN Admin',
      withMadeWithLove: false,
      favicon: '/gentrain-icon.ico',
      logo: '/gentrain-logo.svg',
      theme: {
        colors: { primary100: '#f97316' },
      },
    },
    defaultTheme: 'light',
    componentLoader,
    resources: [createUserResource(prisma), createPathogenResource(prisma), createRoleResource(prisma)],
  } as AdminJSOptions;

  return options;
};
