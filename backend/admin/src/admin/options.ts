import { AdminJSOptions } from 'adminjs';
import { componentLoader, Dashboard } from './component-loader.js';
import { createUserResource } from './resources/createUserResource.js';
import { createPathogenResource } from './resources/createPathogenResource.js';
import { createRoleResource } from './resources/createRoleResource.js';
import LoggerResource from './resources/createLoggerResource.js';
import { createPasswordResource } from './resources/createPasswordResource.js';

export const createAdminJsOptions = () => {
  const options: AdminJSOptions = {
    rootPath: '/admin',
    dashboard: {
      component: Dashboard,
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
    resources: [
      createUserResource(),
      createPathogenResource(),
      createRoleResource(),
      createPasswordResource(),
      LoggerResource,
    ],
  };

  return options;
};
