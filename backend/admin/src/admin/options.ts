import { AdminJSOptions } from 'adminjs';
import { componentLoader, Components } from './component-loader.js';
import initialize from 'src/db/index.js';

/* const { prisma } = await initialize(); // PrismaClient aus deinem initialize holen
 */
const options: AdminJSOptions = {
  rootPath: '/admin',
  /*   dashboard: {
    component: Components.Dashboard,
  }, */
  pages: {},
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
  resources: [],
  databases: [],
};

export default options;
