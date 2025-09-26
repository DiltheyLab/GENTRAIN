import { ActionRequest, ActionContext, ValidationError } from 'adminjs';
import { isPOSTMethod } from '../admin.utils.js';
import { hash, verify } from 'argon2';
import { prisma } from '../db.js';

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
    if (request.payload.new_password !== request.payload.repeat_password) {
      throw new ValidationError(
        { repeat_password: { message: 'Password do not match' } },
        { message: 'Passwords was not changed' }
      );
    }
    request.payload.updated_at = new Date();
    request.payload.password = await hash(request.payload.new_password);
  }
  return request;
};
