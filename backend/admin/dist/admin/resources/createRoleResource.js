import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
export const createRoleResource = (prisma) => {
    return {
        resource: { model: getModelByName('role'), client: prisma },
        options: {
            navigation: navigation,
            properties: {
                name: {
                    isRequired: true,
                    type: 'string',
                },
                permissions: {
                    isArray: true,
                    type: 'string',
                    availableValues: [
                        { value: 'read', label: 'Read' },
                        { value: 'write', label: 'Write' },
                        { value: 'delete', label: 'Delete' },
                    ],
                },
            },
        },
    };
};
