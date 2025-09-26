import { ResourceOptions } from 'adminjs';
import { getModelByName } from '@adminjs/prisma';
import { isCurrentUser, isSuperuser } from '../auth-provider.js';
import { prisma } from '../db.js';

export const createPasswordResource = () => {
  return {
    resource: { model: getModelByName('user'), client: prisma },
    options: {
      id: 'password',
      navigation: null,
      editProperties: ['current_password', 'new_password', 'repeat_password'],
      properties: {
        current_password: {
          isRequired: true,
          type: 'password',
          isVisible: { list: false, filter: false, show: false, edit: true },
        },
        new_password: {
          isRequired: true,
          type: 'password',
          isVisible: { list: false, filter: false, show: false, edit: true },
        },
        repeat_password: {
          isRequired: true,
          type: 'password',
          isVisible: { list: false, filter: false, show: false, edit: true },
        },
      },
      actions: {
        show: { isAccessible: false },
        list: { isAccessible: false },
        new: { isAccessible: false },
        edit: {
          isAccessible: ({ currentAdmin, record }) => isCurrentUser(currentAdmin, record),
          before: [],
          after: [],
        },
      },
    } as ResourceOptions,
  };
};
