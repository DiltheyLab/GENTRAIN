import AdminJSExpress from '@adminjs/express';
import ConnectPgSimple from 'connect-pg-simple';
import session from 'express-session';
export const authenticateUser = async (email, password) => {
    return true;
};
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
        authenticate: authenticateUser,
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_SECRET ?? 'sessionsecret',
    }, router);
};
