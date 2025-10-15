import React from 'react';
import { Box, Icon } from '@adminjs/design-system';
import { RecordJSON } from 'adminjs';
import { getReadableSize, sanitizeFileName } from '../util/helpers.js';
import { SchemeDownload } from './SchemeDownload.js';

export const UploadedScheme = (props: { record: RecordJSON }) => {
  const { record } = props;
  const schemeSize = record.params.scheme_size;
  const schemeVersion = record.params.scheme_version
    ? new Date(record.params.scheme_version).toLocaleString('de-DE', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : null;

  return (
    <Box
      flex
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        border: '1px solid rgb(187, 195, 203)',
        borderRadius: 4,
      }}
    >
      <Box flex style={{ alignItems: 'center' }}>
        <Box>
          <Icon style={{ margin: '0 10px' }} icon="Folder" size={20} />
        </Box>
        <Box style={{ fontSize: 12, marginLeft: 10, color: 'rgb(69, 70, 85)' }}>
          Version: {schemeVersion}
          <br />
          Size on filesystem: {getReadableSize(schemeSize)}
        </Box>
      </Box>
      <SchemeDownload record={record} />
    </Box>
  );
};
