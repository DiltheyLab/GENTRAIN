export type AuthUser = {
  email: string;
  password: string;
};
export const DEFAULT_ADMIN: AuthUser = {
  email: 'admin@example.com',
  password: 'password',
};
