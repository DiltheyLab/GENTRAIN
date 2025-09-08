import { ListActionResponse, RecordActionResponse, ResourceOptions } from 'adminjs';
import { navigation } from '../options.js';
import { getModelByName } from '@adminjs/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { hash } from 'argon2';

export const createUserResource = (prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) => {
  return {
    resource: { model: getModelByName('user'), client: prisma },
    options: {
      navigation: navigation, // Add resource to navigation
      properties: {
        username: {
          position: 2,
          isRequired: true,
          type: 'string',
        },
        password: {
          isRequired: true,
          type: 'password',
          isVisible: { list: false, filter: false, show: false, edit: true },
        },
        confirmed_at: {
          isVisible: {
            list: true,
            filter: true,
            show: true,
            edit: false,
          },
        },
        created_at: {
          isVisible: {
            list: true,
            filter: true,
            show: true,
            edit: false,
          },
        },
        updated_at: {
          isVisible: {
            list: true,
            filter: true,
            show: true,
            edit: false,
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            // hash password before saving
            if (request.payload?.password) {
              request.payload.password = await hash(request.payload.password);
            }
            return request;
          },
        },
        show: {
          after: async (response: RecordActionResponse) => {
            // prevent password from being sent to the client
            response.record.params.password = '';
            return response;
          },
        },
        edit: {
          before: async (request) => {
            // no need to hash on GET requests, we'll remove passwords there anyway
            if (request.method === 'post') {
              // hash only if password is present, delete otherwise
              // so we don't overwrite it
              if (request.payload?.password) {
                request.payload.password = await hash(request.payload.password);
                request.payload.updated_at = new Date();
              } else {
                delete request.payload?.password;
              }
            }
            return request;
          },
          after: async (response: RecordActionResponse) => {
            // prevent password from being sent to the client
            response.record.params.password = '';
            return response;
          },
        },
        list: {
          after: async (response: ListActionResponse) => {
            // prevent password from being sent to the client
            response.records.forEach((record) => {
              record.params.password = '';
            });
            return response;
          },
        },
      },
    } as ResourceOptions,
  };
};
