import React, { useState } from 'react';
import { Box, DropZone, DropZoneItem, FormGroup, FormMessage, Text } from '@adminjs/design-system';
import { BasePropertyProps, PropertyLabel, useTranslation } from 'adminjs';

const SchemeUpload = (props: BasePropertyProps) => {
  const { onChange, property, record } = props;

  const [_, setFile] = useState<File | null>(null);
  const schemeSize = record.params.scheme_size;
  const schemeVersion = record.params.scheme_version
    ? new Date(record.params.scheme_version).toLocaleString('de-DE', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : null;
  const { tm } = useTranslation();
  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      onChange(property.name, files[0]);
    }
  };

  const error = record.errors?.[property.path];
  console.log(schemeVersion, schemeSize);
  return (
    <FormGroup error={Boolean(error)}>
      <Box flex style={{ justifyContent: 'space-between' }}>
        <PropertyLabel property={property} />
      </Box>
      <DropZone onChange={handleDrop} />
      {schemeVersion && <DropZoneItem filename={`Version: <${schemeVersion}>, Size: ${schemeSize} MB`} src={'test'} />}
      <FormMessage>{error && tm(error.message, property.resourceId)}</FormMessage>
    </FormGroup>
  );
};

export default SchemeUpload;
