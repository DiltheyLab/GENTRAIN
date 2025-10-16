import { ShowPropertyProps, useTranslation } from 'adminjs';
import React, { useEffect } from 'react';
import { Box, Icon, ValueGroup } from '@adminjs/design-system';
import { ExampleDataDownload } from './ExampleDataDownload.js';
import { sanitizeFileName } from '../util/helpers.js';

const ExampleDataDownloadShow: React.FC<ShowPropertyProps> = (props) => {
  const { record, property } = props;
  const { translateProperty } = useTranslation();
  const [blob, setBlob] = React.useState<Blob | null>(null);

  useEffect(() => {
    getBlob();
  }, []);

  const getBlob = () => {
    fetch(`${process.env.API_HOST}/pathogens/${record.id}/example_data/${property.custom.type}`, {
      method: 'GET',
      headers: {
        'Access-Control-Expose-Headers': 'Content-Disposition',
      },
    }).then((response) => {
      if (response.ok) {
        response.blob().then((data) => {
          setBlob(data);
        });
      }
    });
  };

  const getFileName = () => {
    switch (property.custom.type) {
      case 'case':
        return `${sanitizeFileName(record.params.name)}_${property.custom.filename}.csv`;
      case 'sequence':
        return `${sanitizeFileName(record.params.name)}_sequenzdaten.${record.params.type === 'viral' ? 'fasta' : 'zip'}`;
      case 'contact':
        return `${sanitizeFileName(record.params.name)}_kontaktdaten.csv`;
      default:
        throw new Error('Unknown type for example data download');
    }
  };

  if (!blob) {
    return;
  }

  return (
    <ValueGroup label={translateProperty(property.label, property.resourceId)}>
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
          <Icon style={{ margin: '0 10px' }} icon="Paperclip" size={20} />
          <Box style={{ fontSize: 12, marginLeft: 10, color: 'rgb(69, 70, 85)' }}>{getFileName()}</Box>
        </Box>
        <ExampleDataDownload record={record} type={property.custom.type} filename={getFileName()} blob={blob} />
      </Box>
    </ValueGroup>
  );
};

export default ExampleDataDownloadShow;
