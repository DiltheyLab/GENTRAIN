import { ActionRequest } from 'adminjs';

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
  return filename.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
};

export const isPOSTMethod = ({ method }: ActionRequest): boolean => method.toLowerCase() === 'post';

export const isGETMethod = ({ method }: ActionRequest): boolean => method.toLowerCase() === 'get';

export const isNewAction = ({ params: { action } }: ActionRequest): boolean => action === 'new';

export const isEditAction = ({ params: { action } }: ActionRequest): boolean => action === 'edit';
