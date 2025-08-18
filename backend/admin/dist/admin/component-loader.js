import { ComponentLoader } from 'adminjs';
import path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();
export const add = (componentName, url) => componentLoader.add(componentName, path.join(__dirname, url));
export const override = (componentName, url) => componentLoader.override(componentName, path.join(__dirname, url));
override('Login', 'components/Login');
export const DASHBOARD = add('Dashboard', './components/Dashboard');
