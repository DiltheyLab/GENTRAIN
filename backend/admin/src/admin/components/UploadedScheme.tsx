import React, { useState } from 'react';
import { Box, Icon } from '@adminjs/design-system';
import AdminJS, { RecordJSON } from 'adminjs';
import getReadableSize from '../util/Helper.js';

const UploadedScheme = (props: { record: RecordJSON }) => {
  const { record } = props;
  const [downloading, setDownloading] = useState(false);
  const schemeSize = record.params.scheme_size;
  const schemeVersion = record.params.scheme_version
    ? new Date(record.params.scheme_version).toLocaleString('de-DE', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : null;

  const triggerSchemeDownload = async () => {
    try {
      setDownloading(true);

      const response = await fetch(`${process.env.API_HOST}/schemes/${record.id}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${record.params.name}_scheme.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloading(false);
    } catch (error) {
      console.error('Error downloading ZIP:', error);
    }
  };

  return (
    <Box
      flex
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        padding: 8,
        border: '1px solid rgb(187, 195, 203)',
        borderRadius: 4,
      }}
    >
      <Box flex style={{ alignItems: 'center' }}>
        <Box>
          <Icon
            style={{ margin: '0 10px', cursor: downloading ? 'auto' : 'pointer' }}
            icon="Folder"
            size={20}
            onClick={!downloading ? triggerSchemeDownload : null}
          />
        </Box>
        <Box style={{ fontSize: 12, marginLeft: 10, color: 'rgb(69, 70, 85)' }}>
          Version: {schemeVersion}
          <br />
          Size on filesystem: {getReadableSize(schemeSize)}
        </Box>
      </Box>
      <Box
        width={30}
        height={30}
        flex
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          marginRight: 8,
          border: !downloading ? '1px solid rgb(187, 195, 203)' : '',
        }}
      >
        <Icon
          style={{ cursor: downloading ? 'auto' : 'pointer' }}
          icon={downloading ? 'Loader' : 'Download'}
          size={downloading ? 20 : 15}
          color="rgb(69, 70, 85)"
          onClick={!downloading ? triggerSchemeDownload : null}
          spin={downloading}
        />
      </Box>
    </Box>
  );
};

export default UploadedScheme;
