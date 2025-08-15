import React from 'react';
import { Box } from '@adminjs/design-system';
const Dashboard = () => {
    return (React.createElement(Box, { variant: "grey" },
        React.createElement("h1", null, "Hallo, AdminJS!"),
        React.createElement("p", null, "Dies ist meine erste eigene Komponente im Frontend. ")));
};
export default Dashboard;
