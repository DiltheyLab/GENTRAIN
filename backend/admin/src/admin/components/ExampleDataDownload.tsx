import React, { useState } from 'react';
import { Box, Icon } from '@adminjs/design-system';
import { RecordJSON } from 'adminjs';

export const ExampleDataDownload = (props: { record: RecordJSON; type: string; filename: string; blob: Blob }) => {
  const [downloading, setDownloading] = useState(false);

  const triggerDownload = async (evt: any) => {
    evt.preventDefault();
    if (!props.blob) {
      return;
    }
    setDownloading(true);
    const url = window.URL.createObjectURL(props.blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', props.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setDownloading(false);
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
        opacity: props.blob ? 1 : 0.5,
      }}
    >
      <Icon
        style={{ cursor: downloading || !props.blob ? 'auto' : 'pointer', marginTop: 2 }}
        icon={downloading ? 'Loader' : 'Download'}
        size={downloading ? 20 : 15}
        color="rgb(69, 70, 85)"
        onClick={!downloading ? triggerDownload : null}
        spin={downloading}
      />
    </Box>
  );
};
