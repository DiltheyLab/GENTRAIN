import { RecordActionResponse, ListActionResponse, BaseRecord } from 'adminjs';

export const sanitizeUserResponse = async (response: RecordActionResponse | ListActionResponse) => {
  if ('record' in response && response.record) {
    response.record.params.password = '';
  }
  if ('records' in response) {
    response.records.forEach((record: BaseRecord) => {
      record.params.password = '';
    });
  }
  return response;
};
