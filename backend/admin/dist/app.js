import express from 'express';
import AdminJS from 'adminjs';
import options from './admin/options.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { expressAuthenticatedRouter } from './admin/router.js';
import { Database, getModelByName, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
const port = process.env.ADMIN_PANEL_PORT;
const start = async () => {
    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const publicPath = path.join(__dirname, '..', 'public');
    app.use(express.static(publicPath));
    const prisma = new PrismaClient();
    AdminJS.registerAdapter({ Database, Resource });
    const admin = new AdminJS({
        ...options,
        resources: [
            {
                resource: { model: getModelByName('User'), client: prisma },
                options: {},
            },
        ],
    });
    if (process.env.NODE_ENV === 'production') {
        console.log('initialized in production mode');
        await admin.initialize();
    }
    else {
        console.log('started in development mode');
        admin.watch();
    }
    const adminRouter = expressAuthenticatedRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
    app.listen(port, () => {
        console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
    });
};
start();
