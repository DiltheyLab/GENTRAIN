import React, { useState } from 'react';
import { Icon } from '@adminjs/design-system';
import { RecordJSON } from 'adminjs';
import { sanitizeFileName } from '../util/Helper.js';

export const SchemeDownload = (props: { record: RecordJSON }) => {
  const { record } = props;
  const [downloading, setDownloading] = useState(false);

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
      link.setAttribute('download', `${sanitizeFileName(encodeURIComponent(record.params.name))}_scheme.zip`);
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
    <Icon
      style={{ cursor: downloading ? 'auto' : 'pointer' }}
      icon={downloading ? 'Loader' : 'Download'}
      size={downloading ? 20 : 15}
      color="rgb(69, 70, 85)"
      onClick={!downloading ? triggerSchemeDownload : null}
      spin={downloading}
    />
  );
};
