import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import argon2 from 'argon2';
import ConnectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { Router } from 'express';

export const authenticateUser = async (email, password) => {
  /*  const user = await AdminModel.findOne({ email });
   if (user && (await argon2.verify(user.password, password))) {
    return { ...userData, ...user.toObject() };
  }
  return null; */
  return true; //löschen!!
};

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
      authenticate: authenticateUser,
      cookieName: 'adminjs',
      cookiePassword: process.env.COOKIE_SECRET ?? 'sessionsecret',
    },
    router
    /*     {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET ?? 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    } */
  );
};
