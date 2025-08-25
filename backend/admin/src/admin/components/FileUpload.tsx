import React, { useState } from 'react';
import { Box, Button, DropZone, H5, Text } from '@adminjs/design-system';
import { useNotice, ActionProps } from 'adminjs';

const UploadSchemeComponent = (props: ActionProps) => {
  const { action, record, resource } = props;
  const [file, setFile] = useState<File | null>(null);
  const sendNotice = useNotice();

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      sendNotice({ message: 'Please select a file.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${resource.href}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.notice) {
      sendNotice(data.notice);
    }
  };

  return (
    <Box variant="card">
      <H5>Upload Scheme</H5>
      <Text>Choose a file from your computer.</Text>
      <DropZone onChange={handleDrop} />
      {file && (
        <Box mt="md">
          <Text>Selected file: {file.name}</Text>
        </Box>
      )}
      <Button onClick={handleSubmit} mt="md">
        Upload
      </Button>
    </Box>
  );
};

export default UploadSchemeComponent;
