import express from 'express';
import AdminJS from 'adminjs';
import options from './admin/options.js';
import initializeDb from './db/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { expressAuthenticatedRouter } from './admin/router.js';
const port = process.env.ADMIN_PANEL_PORT || 5000;
const start = async () => {
    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const publicPath = path.join(__dirname, '..', 'public');
    app.use(express.static(publicPath));
    await initializeDb();
    const admin = new AdminJS(options);
    if (process.env.NODE_ENV === 'production') {
        console.log('prodMode');
        await admin.initialize();
    }
    else {
        console.log('devMode');
        admin.watch();
    }
    const adminRouter = expressAuthenticatedRouter(admin);
    app.use(admin.options.rootPath, adminRouter);
    app.listen(port, () => {
        console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
    });
};
start();
