import { createLoggerResource, LoggerFeatureOptions } from '@adminjs/logger';
import { getModelByName } from '@adminjs/prisma';

import { componentLoader } from '../component-loader.js';
import { isSuperuser } from '../auth-provider.js';
import { sanitizeLogResponse } from '../hooks/sanitizeLogResponse.js';
import { prisma } from '../db.js';

const config = {
  componentLoader,
  resource: { model: getModelByName('Log'), client: prisma },
  featureOptions: {
    componentLoader,
    propertiesMapping: {
      user: 'userId',
    },
    resourceOptions: {
      actions: {
        list: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeLogResponse],
        },
        show: {
          isAccessible: ({ currentAdmin }) => isSuperuser(currentAdmin),
          after: [sanitizeLogResponse],
        },
      },
    },
  } as LoggerFeatureOptions,
};

const LoggerResource = createLoggerResource(config);

export default LoggerResource;
