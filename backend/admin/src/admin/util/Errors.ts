import { ActionContext, ValidationError } from 'adminjs';

const collectValidationErrors = (error: Error, context: ActionContext) => {
  if (error instanceof ValidationError) {
    context.errors = Object.assign({}, context.errors, error.propertyErrors);
  } else {
    throw error;
  }
};

export { collectValidationErrors };
