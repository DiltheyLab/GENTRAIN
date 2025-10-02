import express from 'express';
import AdminJS, { defaultConfig } from 'adminjs';
import { createAdminJsOptions } from './admin/options.js';
import path from 'path';
import { expressAuthenticatedRouter } from './admin/router.js';
import { Database, Resource } from '@adminjs/prisma';
import * as url from 'url';
import { prisma } from './admin/db.js';
import bodyParser from 'body-parser';

const port = process.env.ADMIN_PANEL_PORT;

const start = async () => {
  // Create express app
  const app = express();
  app.enable('trust proxy');

  // Setup static public folder for assets
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
  app.use(express.static(path.join(__dirname, '../public'))); // path from dist to public

  // Setup Prisma Client and register it in AdminJS
  await prisma.$connect();

  AdminJS.registerAdapter({ Database, Resource });

  const options = createAdminJsOptions();

  // Create AdminJS with options
  const admin = new AdminJS(options);

  admin.options.env = Object.assign({}, admin.options.env, { API_HOST: process.env.VITE_API_HOST });

  // Compile tsx in js
  if (process.env.NODE_ENV === 'production') {
    console.log('initialized in production mode');
    await admin.initialize();
  } else {
    console.log('started in development mode');
    admin.watch();
  }

  // create router with authentification
  const adminRouter = expressAuthenticatedRouter(admin);

  // set path under you can access the admin panel
  app.use(admin.options.rootPath, adminRouter);

  app.use(bodyParser.json({ limit: '300mb' }));

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
