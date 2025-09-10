import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import ConnectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { Router } from 'express';
import { authProvider } from './auth-provider.js';

export const expressAuthenticatedRouter = (adminJs: AdminJS, router: Router | null = null) => {
  const ConnectSession = ConnectPgSimple(session);

  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
  });

  return AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_SECRET ?? 'sessionsecret',
      provider: authProvider,
    },
    router,
    {
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET ?? 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
      name: 'adminjs',
    }
  );
};
