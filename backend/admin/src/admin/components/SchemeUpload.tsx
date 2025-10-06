import React, { useState } from 'react';
import { Box, DropZone, FormGroup, FormMessage, Icon, Link, Loader } from '@adminjs/design-system';
import { BasePropertyProps, PropertyLabel, useTranslation } from 'adminjs';
import { UploadedScheme } from './UploadedScheme.js';

const SchemeUpload = (props: BasePropertyProps) => {
  const { onChange, property, record } = props;
  const [_, setFile] = useState<File | null>(null);
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
  return (
    <FormGroup error={Boolean(error)}>
      <PropertyLabel property={property} />
      <DropZone onChange={handleDrop} validate={{ maxSize: 300 * 1024 * 1024 }} />
      {schemeVersion && (
        <Box style={{ marginTop: 16 }}>
          <UploadedScheme record={record} />
        </Box>
      )}
      {error && <FormMessage>tm(error.message, property.resourceId)</FormMessage>}
    </FormGroup>
  );
};

export default SchemeUpload;
