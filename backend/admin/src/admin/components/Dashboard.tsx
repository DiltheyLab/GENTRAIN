import React from 'react';
import { Box, H1, H2, Text } from '@adminjs/design-system';

const Dashboard = () => {
  return (
    <Box variant="grey">
      <Box variant="white" p="xl" textAlign="center">
        <H1 fontWeight="lighter">GENTRAIN Admin</H1>
        <Text fontWeight="lighter" mt="default">
          Willkommen im GENTRAIN Admin-Bereich! Hier können Sie die Pathogen-Datenbank verwalten, Benutzer für das
          Admin-Panel anlegen und entsprechende Benutzetrollen zuweisen. In der linken Seitenleiste finden Sie die
          Navigation zu den verschiedenen Bereichen.
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;
