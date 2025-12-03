import { RecordActionResponse, ListActionResponse, BaseRecord } from 'adminjs';

export const sanitizeLogResponse = (response: RecordActionResponse | ListActionResponse) => {
  if ('record' in response && response.record) {
    const difference = JSON.parse(response.record.params.difference);
    difference.password = undefined;
    response.record.params.difference = JSON.stringify(difference);
  }
  if ('records' in response) {
    response.records.forEach((record: BaseRecord) => {
      const difference = JSON.parse(record.params.difference);
      difference.password = undefined;
      record.params.difference = JSON.stringify(difference);
    });
  }

  return response;
};
