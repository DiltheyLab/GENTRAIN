import express from 'express';
import AdminJS from 'adminjs';
import { createAdminJsOptions } from './admin/options.js';
import path from 'path';
import { expressAuthenticatedRouter } from './admin/router.js';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import * as url from 'url';

const port = process.env.ADMIN_PANEL_PORT;

const start = async () => {
  // Create express app
  const app = express();
  app.enable('trust proxy');

  // Setup static public folder for assets
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
  app.use(express.static(path.join(__dirname, '../public'))); // path from dist to public

  // Setup Prisma Client and register it in AdminJS
  const prisma = new PrismaClient();

  AdminJS.registerAdapter({ Database, Resource });

  const options = createAdminJsOptions(prisma);

  // Create AdminJS with options
  const admin = new AdminJS(options);

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
