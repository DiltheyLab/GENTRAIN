import { ActionRequest, ActionContext, ValidationError } from 'adminjs';
import { validatePasswordPattern } from '../util/validations.js';
import { hash } from 'argon2';
import { isPOSTMethod } from '../util/helpers.js';

export const validateUser = async (request: ActionRequest, context?: ActionContext) => {
  if (isPOSTMethod(request)) {
    if (context.record) {
      // AdminJS fetches the current user password in case an error occured
      // We overwrite this with the current form input in order to prevent displaying it
      context.record.params.password = request.payload.password;
    }
    // hash only if password is present, delete otherwise so it will not overwrite existing password with empty string
    if (request.payload?.password) {
      if (!validatePasswordPattern(request.payload.password)) {
        throw new ValidationError(
          {
            password: {
              message:
                'Password must contain at least 8 characters, one special character, one lowercase character, one uppercase character and one digit',
            },
          },
          { message: 'User was not updated' }
        );
      } else {
        request.payload.password = await hash(request.payload.password);
      }
    } else {
      delete request.payload?.password;
    }
    request.payload.updated_at = new Date();
  }
  return request;
};
