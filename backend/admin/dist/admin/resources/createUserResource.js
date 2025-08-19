import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
export const createUserResource = (prisma) => {
    return {
        resource: { model: getModelByName('user'), client: prisma },
        options: {
            navigation: navigation,
            properties: {
                email: {
                    isRequired: true,
                    type: 'string',
                },
                password: {
                    isRequired: true,
                    type: 'password',
                    isVisible: { list: false, filter: false, show: false, edit: true },
                },
            },
        },
    };
};
