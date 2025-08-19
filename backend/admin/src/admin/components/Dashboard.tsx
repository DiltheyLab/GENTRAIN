import React from 'react';
import { Box, H1, H2, Text } from '@adminjs/design-system';

const Dashboard = () => {
  return (
    <Box variant="grey">
      <Box variant="white" p="xl" textAlign="center">
        <H1 fontWeight="lighter">GENTRAIN Admin</H1>
        <Text fontWeight="lighter" mt="default">
          Welcome to the GENTRAIN admin panel. Here you can manage the pathogen database, create users for the admin
          panel and assign user roles. Use the navigation on the left sidebar to access different sections.
        </Text>
      </Box>
    </Box>
  );
};

export default Dashboard;
