/* import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add('Dashboard', './components/Dashboard'),
  Login: componentLoader.override('Login', './components/Login'),
};

export { componentLoader, Components };
 */

import { ComponentLoader, OverridableComponent } from 'adminjs';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export const componentLoader = new ComponentLoader();

export const add = (componentName: string, url: string): string =>
  componentLoader.add(componentName, path.join(__dirname, url));

export const override = (componentName: OverridableComponent, url: string): string =>
  componentLoader.override(componentName, path.join(__dirname, url));

/**
 * Overridable components
 */
override('Login', 'components/Login');
override('LoggedIn', 'components/LoggedIn');

/**
 * Add components
 */
export const Dashboard = add('Dashboard', './components/Dashboard');
export const SchemeUpload = add('SchemeUpload', './components/SchemeUpload');
export const SchemeDownloadList = add('SchemeDownloadList', './components/SchemeDownloadList');
export const SchemeDownloadShow = add('SchemeDownloadShow', './components/SchemeDownloadShow');
export const SchemeTypeSelectEdit = add('SchemeTypeSelectEdit', './components/SchemeTypeSelectEdit');
export const ErrorMessage = add('ErrorMessage', './components/ErrorMessage');
export const ExampleDataShow = add('ExampleDataShow', './components/ExampleDataShow');
