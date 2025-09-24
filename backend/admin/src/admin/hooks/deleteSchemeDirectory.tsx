import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';
import path from 'path';
import fs from 'fs';

export const deleteSchemeDirectory = async (
  response: ActionResponse,
  _request: ActionRequest,
  context: ActionContext
) => {
  const { record } = context;
  const folderName = record.params.id.toString();
  const extractPath = path.join('../modules/sequence_analysis/schemes', folderName);
  if (fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString()))) {
    await fs.promises.rmdir(extractPath, { recursive: true });
  }
};
export default deleteSchemeDirectory;
