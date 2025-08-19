import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
export const createPathogenResource = (prisma) => {
    return {
        resource: { model: getModelByName('pathogen'), client: prisma },
        options: {
            navigation: navigation,
            properties: {
                type: {
                    availableValues: [
                        { value: 'bacterial', label: 'Bacterial' },
                        { value: 'viral', label: 'Viral' },
                    ],
                },
                genetic_distance_threshold: {
                    type: 'number',
                },
            },
        },
    };
};
