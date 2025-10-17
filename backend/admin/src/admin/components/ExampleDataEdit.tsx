import { Box, DropZone, DropZoneItem, FormGroup, Icon, Label } from '@adminjs/design-system';
import { EditPropertyProps, flat, useTranslation } from 'adminjs';
import React, { FC, useEffect, useState } from 'react';
import { ExampleDataDownload } from './ExampleDataDownload.js';
import { sanitizeFileName } from '../util/helpers.js';

const ExampleDataEdit: FC<EditPropertyProps> = ({ property, record, onChange }) => {
  const { translateProperty } = useTranslation();
  const { params } = record;
  const { custom } = property as unknown as { custom: any };

  const path = flat.get(params, custom.filePathProperty);
  const key = flat.get(params, custom.keyProperty);
  const file = flat.get(params, custom.fileProperty);

  const [originalKey, setOriginalKey] = useState(key);
  const [filesToUpload, setFilesToUpload] = useState<Array<File>>([]);

  const [blob, setBlob] = React.useState<Blob | null>(null);

  const getBlob = () => {
    if (record.params?.[property.custom.key]) {
      fetch(`${process.env.API_HOST}/pathogens/${record.id}/example_data/${property.custom.type}`, {
        method: 'GET',
      }).then((response) => {
        if (response.ok) {
          response.blob().then((data) => {
            setBlob(data);
          });
        } else {
          throw new Error(`File does not exists.`);
        }
      });
    }
  };

  useEffect(() => {
    // it means means that someone hit save and new file has been uploaded
    // in this case fliesToUpload should be cleared.
    // This happens when user turns off redirect after new/edit
    if (
      (typeof key === 'string' && key !== originalKey) ||
      (typeof key !== 'string' && !originalKey) ||
      (typeof key !== 'string' && Array.isArray(key) && key.length !== originalKey.length)
    ) {
      setOriginalKey(key);
      setFilesToUpload([]);
    }
    getBlob();
  }, [key, originalKey]);

  const onUpload = (files: Array<File>): void => {
    setFilesToUpload(files);
    onChange(custom.fileProperty, files);
  };

  const handleRemove = () => {
    onChange(custom.fileProperty, null);
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

  const handleMultiRemove = (singleKey) => {
    const index = (flat.get(record.params, custom.keyProperty) || []).indexOf(singleKey);
    const filesToDelete = flat.get(record.params, custom.filesToDeleteProperty) || [];
    if (path && path.length > 0) {
      const newPath = path.map((currentPath, i) => (i !== index ? currentPath : null));
      let newParams = flat.set(record.params, custom.filesToDeleteProperty, [...filesToDelete, index]);
      newParams = flat.set(newParams, custom.filePathProperty, newPath);

      onChange({
        ...record,
        params: newParams,
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('You cannot remove file when there are no uploaded files yet');
    }
  };

  return (
    <FormGroup>
      <Label>{translateProperty(property.label, property.resourceId)}</Label>
      <DropZone
        onChange={onUpload}
        multiple={custom.multiple}
        validate={{
          mimeTypes: custom.mimeTypes as Array<string>,
          maxSize: custom.maxSize,
        }}
        files={filesToUpload}
      />
      {!custom.multiple && key && path && !filesToUpload.length && file !== null && (
        <Box
          flex
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 8,
            border: '1px solid rgb(187, 195, 203)',
            borderRadius: 4,
            marginTop: 16,
          }}
        >
          <Box flex style={{ alignItems: 'center' }}>
            <Icon style={{ margin: '0 10px' }} icon="Paperclip" size={20} />
            <Box style={{ fontSize: 12, marginLeft: 10, color: 'rgb(69, 70, 85)' }}>{getFileName()}</Box>
          </Box>
          <Box flex>
            <ExampleDataDownload record={record} type={custom.type} filename={key} blob={blob} />
            <Box
              width={30}
              height={30}
              flex
              style={{
                position: 'relative',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '50%',
                marginRight: 8,
                border: '1px solid rgb(187, 195, 203)',
              }}
            >
              <Icon
                icon="X"
                style={{ cursor: 'pointer', marginTop: 2 }}
                size={20}
                color="rgb(69, 70, 85)"
                onClick={handleRemove}
              />
            </Box>
          </Box>
        </Box>
      )}
      {custom.multiple && key && key.length && path ? (
        <>
          {key.map((singleKey, index) => {
            // when we remove items we set only path index to nulls.
            // key is still there. This is because
            // we have to maintain all the indexes. So here we simply filter out elements which
            // were removed and display only what was left
            const currentPath = path[index];
            return currentPath ? (
              <DropZoneItem
                key={singleKey}
                filename={singleKey}
                src={path[index]}
                onRemove={() => handleMultiRemove(singleKey)}
              />
            ) : (
              ''
            );
          })}
        </>
      ) : (
        ''
      )}
    </FormGroup>
  );
};

export default ExampleDataEdit;
