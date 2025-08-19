import { componentLoader, DASHBOARD } from './component-loader.js';
import { createUserResource } from './resources/createUserResource.js';
import { createPathogenResource } from './resources/createPathogenResource.js';
import { createRoleResource } from './resources/createRoleResource.js';
export const navigation = {
    name: 'Postgres DB',
    icon: 'Database',
};
export const createAdminJsOptions = (prisma) => {
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
        resources: [createUserResource(prisma), createPathogenResource(prisma), createRoleResource(prisma)],
    };
    return options;
};
