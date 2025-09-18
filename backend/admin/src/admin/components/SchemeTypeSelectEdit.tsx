import { EditPropertyProps, PropertyDescription, PropertyLabel, useTranslation } from 'adminjs';
import React, { FC } from 'react';
import { FormGroup, FormMessage, Select } from '@adminjs/design-system';

const SchemeTypeSelectEdit: FC<EditPropertyProps> = (props) => {
  const { record, property, onChange } = props;
  const error = record.errors?.[property.path];
  const { tm } = useTranslation();

  if (!property.availableValues) {
    return null;
  }

  const propValue = record.params?.[property.path] ?? property.props.value ?? '';
  // eslint-disable-next-line max-len
  const availableValues = property.availableValues.map((v) => ({
    ...v,
    label: tm(`${property.path}.${v.value}`, property.resourceId, { defaultValue: v.label ?? v.value }),
  }));
  // eslint-disable-next-line eqeqeq
  const selected = availableValues.find((av) => av.value == propValue);

  return (
    <FormGroup error={Boolean(error)}>
      <PropertyLabel property={property} />
      <Select
        value={selected}
        options={availableValues}
        onChange={(s) => onChange(property.path, s?.value ?? '')}
        isDisabled={record.params.id ? true : false}
        {...property.props}
      />{' '}
      <FormMessage>{error && tm(error.message, property.resourceId)}</FormMessage>
    </FormGroup>
  );
};

export default SchemeTypeSelectEdit;
