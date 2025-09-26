import { ActionRequest, ActionContext, ValidationError } from 'adminjs';

export const throwValidationErrors = (request: ActionRequest, context: ActionContext) => {
  if (Object.keys(context.errors).length > 0) {
    throw new ValidationError(context.errors);
  }
  return request;
};
