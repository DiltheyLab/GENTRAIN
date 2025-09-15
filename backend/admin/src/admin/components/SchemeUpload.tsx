import React, { useState } from 'react';
import { Box, DropZone, Icon, Label, Text } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';

const SchemeUpload = (props: BasePropertyProps) => {
  const { onChange, property, record } = props;
  const [_, setFile] = useState<File | null>(null);
  const schemeSize = record.params.scheme_size;
  const schemeVersion = record.params.scheme_version;

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      onChange(property.name, files[0]);
    }
  };

  const errorMessage = record?.errors?.[property.name]?.message;

  return (
    <>
      <Box>
        <Box flex style={{ justifyContent: 'space-between' }}>
          <Label htmlFor={property.path}>
            {property.isRequired && (
              <Text display="inline" color="primary100">
                *{' '}
              </Text>
            )}
            {property.custom.label}
          </Label>
          {schemeSize && schemeVersion && (
            <Box flex style={{ alignItems: 'center' }}>
              <Text fontSize="sm">
                Current scheme ({schemeSize}) was uploaded on {schemeVersion}
              </Text>
            </Box>
          )}
        </Box>
        {errorMessage && (
          <Text fontSize="sm" color="error">
            {errorMessage}
          </Text>
        )}
        <DropZone onChange={handleDrop} />
      </Box>
      <Text>&nbsp;</Text>
    </>
  );
};

export default SchemeUpload;
