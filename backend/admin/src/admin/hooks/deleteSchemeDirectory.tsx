import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';
import path from 'path';
import fs from 'fs';
import { API_DATA_DIRECTORY } from '../constants.js';

export const deleteSchemeDirectory = async (
  response: ActionResponse,
  _request: ActionRequest,
  _context: ActionContext
) => {
  if (!response.record && !response.records) {
    return response;
  }
  for (const record of response.records ?? [response.record]) {
    const extractPath = path.join(API_DATA_DIRECTORY, "pathogen_schemes", record.params.id.toString());
    if (fs.existsSync(extractPath)) {
      await fs.promises.rm(extractPath, { recursive: true });
    }
  }
  return response;
};
export default deleteSchemeDirectory;
