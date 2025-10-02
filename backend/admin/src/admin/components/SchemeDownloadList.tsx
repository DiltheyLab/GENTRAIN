import { ShowPropertyProps } from 'adminjs';
import React from 'react';
import { SchemeDownload } from './SchemeDownload.js';

const SchemeDownloadList: React.FC<ShowPropertyProps> = (props) => {
  const { record } = props;

  return <SchemeDownload record={record} />;
};

export default SchemeDownloadList;
