import { RecordActionResponse, ListActionResponse, ActionContext, ActionRequest } from 'adminjs';
import { getReadableSize, isGETMethod } from '../util/helpers.js';

export const readableSchemeSize = (
  response: RecordActionResponse | ListActionResponse,
  request: ActionRequest,
  _context: ActionContext
) => {
  if (!response.record && !response.records) {
    return response;
  }

  if (isGETMethod(request)) {
    for (const record of response.records ?? [response.record]) {
      const schemeSizeInBytes = record.params.scheme_size;

      record.params.scheme_size = getReadableSize(schemeSizeInBytes);
    }
  }

  return response;
};
