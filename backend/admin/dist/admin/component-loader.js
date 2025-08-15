import { ComponentLoader } from 'adminjs';
const componentLoader = new ComponentLoader();
const Components = {
    Dashboard: componentLoader.add('Dashboard', './components/Dashboard'),
};
export { componentLoader, Components };
