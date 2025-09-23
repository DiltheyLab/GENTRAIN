import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';
import getFolderSize from 'get-folder-size';
import path from 'path';

export const fillSchemeSizesFromDirectories = async (
  response: ActionResponse,
  _request: ActionRequest,
  context: ActionContext
) => {
  if (!response.record && !response.records) {
    return response;
  }
  for (const record of response.records ?? [response.record]) {
    const size = await getFolderSize.strict(
      path.join('../modules/sequence_analysis/schemes', record.params.id.toString())
    );
    record.params.scheme_size = `${size.toFixed(2)} MB`;
  }

  return response;
};

export default fillSchemeSizesFromDirectories;
