import { PropertyLabel, ShowPropertyProps, useTranslation } from 'adminjs';
import React from 'react';
import { UploadedScheme } from './UploadedScheme.js';
import { ValueGroup } from '@adminjs/design-system';

const SchemeDownloadShow: React.FC<ShowPropertyProps> = (props) => {
  const { property, record } = props;
  const { translateProperty } = useTranslation();

  return (
    <ValueGroup label={translateProperty(property.label, property.resourceId)}>
      <UploadedScheme record={record} />
    </ValueGroup>
  );
};

export default SchemeDownloadShow;
