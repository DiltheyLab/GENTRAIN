import { RecordActionResponse, ListActionResponse, ActionContext } from 'adminjs';

export const readableSchemeSize = (response: RecordActionResponse | ListActionResponse, _context: ActionContext) => {
  if (!response.record && !response.records) {
    return response;
  }
  for (const record of response.records ?? [response.record]) {
    const schemeSizeInBytes = record.params.scheme_size;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let readableSchemeSize = schemeSizeInBytes;

    while (readableSchemeSize >= 1024 && index < units.length - 1) {
      readableSchemeSize /= 1024;
      index++;
    }
    record.params.scheme_size = `${readableSchemeSize.toFixed(2)} ${units[index]}`;
  }
  return response;
};
