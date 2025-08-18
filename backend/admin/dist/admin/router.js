import AdminJSExpress from '@adminjs/express';
import ConnectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import provider from './auth-provider.js';
export const expressAuthenticatedRouter = (adminJs, router = null) => {
    const ConnectSession = ConnectPgSimple(session);
    const sessionStore = new ConnectSession({
        conObject: {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production',
        },
        tableName: 'session',
        createTableIfMissing: true,
    });
    return AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_SECRET ?? 'sessionsecret',
        provider: provider,
    }, router, {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET ?? 'sessionsecret',
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        },
        name: 'adminjs',
    });
};
