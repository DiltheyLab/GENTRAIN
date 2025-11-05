import {
  BaseRecord, CurrentAdmin, DefaultAuthProvider, DefaultAuthenticatePayload
} from 'adminjs';
import { verify } from 'argon2';
import { AuthenticationContext } from '@adminjs/express';

import { SUPERUSER_ROLE } from './constants.js';
import { componentLoader } from './component-loader.js';
import { prisma } from './db.js';

const authenticate = async (
  payload: DefaultAuthenticatePayload,
  context?: AuthenticationContext
): Promise<CurrentAdmin | null> => {
  const { email: username, password } = payload; // AdminJS sends "email" field by default
  if (!username || !password) return null;

  const user = await prisma.user.findFirst({
    where: { username },
    include: { role: true },
  });

  if (user && (await verify(user.password, password))) {
    return {
      email: user.username, // AdminJS requires an email field, we use username here
      role: user.role.name,
      id: user.id.toString(),
      username: user.username,
    };
  }
  return null;
};

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */
export const authProvider = new DefaultAuthProvider({
  componentLoader,
  authenticate,
});

export const isSuperuser = (currentAdmin: CurrentAdmin, allowedRole = SUPERUSER_ROLE) => {
  return currentAdmin.role === allowedRole;
};

export const isCurrentUser = (currentAdmin: CurrentAdmin, user: BaseRecord) => {
  return user.params.id === parseInt(currentAdmin.id);
};
