import { CurrentAdmin, DefaultAuthProvider, DefaultAuthenticatePayload } from 'adminjs';

import { SUPERUSER_ROLE } from './constants.js';
import { componentLoader } from './component-loader.js';
import { verify } from 'argon2';

type LoginPayload = DefaultAuthenticatePayload & {
  username: string;
};

const authenticate = async (payload: LoginPayload, ctx?: any): Promise<CurrentAdmin | null> => {
  const { username, password } = payload;

  if (!username || !password) return null;

  const user = await prisma.findOne({ username });
  if (user && (await verify(user.password, password))) {
    console.log(user);
    return { ...user.toObject() };
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
  console.log('Current Admin Role:', currentAdmin?.role);
  return currentAdmin.role === allowedRole;
};
