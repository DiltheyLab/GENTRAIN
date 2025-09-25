import React from 'react';
import { FormGroup, FormMessage } from '@adminjs/design-system';
import { BasePropertyProps, useTranslation } from 'adminjs';

const ErrorMessage = (props: BasePropertyProps) => {
  const { property, record } = props;
  const { tm } = useTranslation();
  const error = record.errors?.[property.path];

  return (
    <>
      {error && (
        <FormGroup error={Boolean(error)}>
          <FormMessage>{tm(error.message, property.resourceId)}</FormMessage>
        </FormGroup>
      )}
    </>
  );
};

export default ErrorMessage;
