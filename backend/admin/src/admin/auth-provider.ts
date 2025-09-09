import { CurrentAdmin, DefaultAuthProvider } from 'adminjs';

import { DEFAULT_ADMIN, SUPERUSER_ROLE } from './constants.js';
import { componentLoader } from './component-loader.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */
const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    /*  const user = await AdminModel.findOne({ email });
      if (user && (await argon2.verify(user.password, password))) {
       return { ...userData, ...user.toObject() };
     }
     return null; */
    if (email === DEFAULT_ADMIN.email) {
      return { email };
    }
    return null;
  },
});

export default provider;

/* export const createAuthUsers = async () =>
  Promise.all(
    AuthUsers.map(async ({ email, password }) => {
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        await AdminModel.create({ email, password: await argon2.hash(password) });
      }
    })
  ); */

export const isSuperuser = (currentAdmin: CurrentAdmin, allowedRole = SUPERUSER_ROLE) => {
  console.log('Current Admin Role:', currentAdmin?.role);
  return currentAdmin.role === allowedRole;
};
