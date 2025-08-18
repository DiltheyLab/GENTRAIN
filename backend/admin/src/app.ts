import express from 'express';
import AdminJS from 'adminjs';
import { ResourceOptions } from 'adminjs';

import options from './admin/options.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { expressAuthenticatedRouter } from './admin/router.js';
import { Database, getModelByName, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';

const port = process.env.ADMIN_PANEL_PORT;

const start = async () => {
  // Create express app
  const app = express();

  // Setup static public folder for assets
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, '..', 'public'); // path from dist to public
  app.use(express.static(publicPath));

  // Setup Prisma Client and register it in AdminJS
  const prisma = new PrismaClient();

  AdminJS.registerAdapter({ Database, Resource });

  // Create AdminJS with options
  const admin = new AdminJS({
    ...options,
    resources: [
      {
        resource: { model: getModelByName('user'), client: prisma },
        options: {
          navigation: {
            name: 'Postgres DB',
            icon: 'Database',
          },
        } as ResourceOptions,
      },
      {
        resource: { model: getModelByName('pathogen'), client: prisma },
        options: {
          navigation: {
            name: 'Postgres DB',
            icon: 'Database',
          },
        },
      },
      {
        resource: { model: getModelByName('role'), client: prisma },
        options: {
          navigation: {
            name: 'Postgres DB',
            icon: 'Database',
          },
        },
      },
    ],
  });

  // Compile tsx in js
  if (process.env.NODE_ENV === 'production') {
    console.log('initialized in production mode');
    await admin.initialize();
  } else {
    console.log('started in development mode');
    admin.watch(); // this builds your frontend code in development environment
  }

  // create router with authentification
  const adminRouter = expressAuthenticatedRouter(admin);

  // set path under you can access the admin panel
  app.use(admin.options.rootPath, adminRouter);

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
