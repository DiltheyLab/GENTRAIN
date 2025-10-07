import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';
import path from 'path';
import fs from 'fs';

export const deleteSchemeDirectory = async (
  response: ActionResponse,
  _request: ActionRequest,
  _context: ActionContext
) => {
  if (!response.record && !response.records) {
    return response;
  }
  for (const record of response.records ?? [response.record]) {
    const folderName = record.params.id.toString();
    const extractPath = path.join(process.env.ADMIN_SCHEME_DIRECTORY, folderName);
    if (fs.existsSync(path.join(process.env.ADMIN_SCHEME_DIRECTORY, record.params.id.toString()))) {
      await fs.promises.rm(extractPath, { recursive: true });
    }
  }
  return response;
};
export default deleteSchemeDirectory;
