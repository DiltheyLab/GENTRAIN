import React, { useState } from 'react';
import { Box, Icon } from '@adminjs/design-system';
import { RecordJSON } from 'adminjs';
import { sanitizeFileName } from '../util/helpers.js';

export const SchemeDownload = (props: { record: RecordJSON }) => {
  const { record } = props;
  const [downloading, setDownloading] = useState(false);

  const triggerSchemeDownload = async (evt: any) => {
    evt.preventDefault();
    try {
      setDownloading(true);

      const response = await fetch(`${process.env.API_HOST}/pathogens/${record.id}/scheme`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${sanitizeFileName(record.params.name)}_scheme.zip`);
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
        style={{ cursor: downloading ? 'auto' : 'pointer', marginTop: 2 }}
        icon={downloading ? 'Loader' : 'Download'}
        size={downloading ? 20 : 15}
        color="rgb(69, 70, 85)"
        onClick={!downloading ? triggerSchemeDownload : null}
        spin={downloading}
      />
    </Box>
  );
};
