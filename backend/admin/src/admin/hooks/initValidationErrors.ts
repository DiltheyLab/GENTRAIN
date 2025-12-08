import { ActionRequest, ActionContext } from 'adminjs';

export const initValidationErrors = (request: ActionRequest, context: ActionContext) => {
  context.errors = {};
  return request;
};
