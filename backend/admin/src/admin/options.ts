import { AdminJSOptions } from 'adminjs';
import { componentLoader, DASHBOARD } from './component-loader.js';

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
} as AdminJSOptions;

export default options;
