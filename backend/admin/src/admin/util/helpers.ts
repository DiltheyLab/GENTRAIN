import { ActionRequest, BaseRecord } from 'adminjs';
import fs from 'fs';

export const getReadableSize = (schemeSizeInBytes: number) => {
  if (!schemeSizeInBytes) {
    return null;
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let readableSchemeSize = Number(schemeSizeInBytes);

  while (readableSchemeSize >= 1024 && index < units.length - 1) {
    readableSchemeSize /= 1024;
    index++;
  }
  return `${readableSchemeSize.toFixed(2)} ${units[index]}`;
};

export const sanitizeFileName = (filename: string) => {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
};

export const getAvailableDiskSpaceInGigabyte: (record: BaseRecord) => Promise<number> = async (record: BaseRecord) => {
  return await new Promise((resolve, reject) => {
    fs.statfs('/', (err, stats) => {
      if (err) {
        reject(err);
      } else {
        const availableDiskSpace =
          (stats.bsize * stats.bavail + Number(record.params.scheme_size)) / 1024 / 1024 / 1024; // in GB
        resolve(availableDiskSpace);
      }
    });
  });
};

export const isPOSTMethod = ({ method }: ActionRequest): boolean => method.toLowerCase() === 'post';

export const isGETMethod = ({ method }: ActionRequest): boolean => method.toLowerCase() === 'get';

export const isNewAction = ({ params: { action } }: ActionRequest): boolean => action === 'new';

export const isEditAction = ({ params: { action } }: ActionRequest): boolean => action === 'edit';
