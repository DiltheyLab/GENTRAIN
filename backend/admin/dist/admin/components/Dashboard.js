import React from 'react';
import { Box, H1, Text } from '@adminjs/design-system';
const Dashboard = () => {
    return (React.createElement(Box, { variant: "grey" },
        React.createElement(Box, { variant: "white", p: "xl", textAlign: "center" },
            React.createElement(H1, { fontWeight: "lighter" }, "GENTRAIN Admin"),
            React.createElement(Text, { fontWeight: "lighter", mt: "default" }, "Willkommen im GENTRAIN Admin-Bereich! Hier k\u00F6nnen Sie die Pathogen-Datenbank verwalten, Benutzer f\u00FCr das Admin-Panel anlegen und entsprechende Benutzetrollen zuweisen. In der linken Seitenleiste finden Sie die Navigation zu den verschiedenen Bereichen."))));
};
export default Dashboard;
