import { AdminJSOptions } from 'adminjs';
import { componentLoader, Components } from './component-loader.js';

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
};

export default options;
