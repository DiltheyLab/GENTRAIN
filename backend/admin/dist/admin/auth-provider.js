import { DefaultAuthProvider } from 'adminjs';
import { DEFAULT_ADMIN } from './constants.js';
import { componentLoader } from './component-loader.js';
const provider = new DefaultAuthProvider({
    componentLoader,
    authenticate: async ({ email, password }) => {
        if (email === DEFAULT_ADMIN.email) {
            return { email };
        }
        return null;
    },
});
export default provider;
