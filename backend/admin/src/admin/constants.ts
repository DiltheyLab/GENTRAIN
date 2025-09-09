export type AuthUser = {
  username: string;
  password: string;
};
export const DEFAULT_ADMIN: AuthUser = {
  username: process.env.DEFAULT_ADMIN || 'admin',
  password: process.env.DEFAULT_ADMIN_PASSWORD || 'secretPassword',
};

export const SUPERUSER_ROLE = 'superuser';
