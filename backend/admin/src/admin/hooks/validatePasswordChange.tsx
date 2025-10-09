import { ActionRequest, ActionContext, ValidationError } from 'adminjs';
import { isPOSTMethod } from '../admin.utils.js';
import { hash, verify } from 'argon2';
import { prisma } from '../db.js';
import { validatePasswordPattern } from '../util/validations.js';

export const validatePasswordChange = async (request: ActionRequest, context: ActionContext) => {
  if (isPOSTMethod(request)) {
    const { username } = context.currentAdmin;
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!(await verify(user.password, request.payload.current_password))) {
      throw new ValidationError(
        { current_password: { message: 'Current password is wrong' } },
        { message: 'Password was not changed' }
      );
    }

    if (!validatePasswordPattern(request.payload.new_password)) {
      throw new ValidationError(
        {
          new_password: {
            message:
              'Password must contain at least 8 characters, one special character, one lowercase character, one uppercase character and one digit',
          },
        },
        { message: 'Password was not changed' }
      );
    }

    if (request.payload.new_password !== request.payload.repeat_password) {
      throw new ValidationError(
        { repeat_password: { message: 'Passwords do not match' } },
        { message: 'Password  was not changed' }
      );
    }
    request.payload.updated_at = new Date();
    request.payload.password = await hash(request.payload.new_password);
  }
  return request;
};
