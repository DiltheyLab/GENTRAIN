import { ActionContext, ActionRequest, ActionResponse } from 'adminjs';
import getFolderSize from 'get-folder-size';
import path from 'path';
import unzipper from 'unzipper';
import fs from 'fs';

export const handleSchemeExtraction = async (
  response: ActionResponse,
  _request: ActionRequest,
  context: ActionContext
) => {
  await extractSchemeUpload(context);
  await persistExtractedSchemeSize(context);

  return response;
};

const extractSchemeUpload = async (context: ActionContext) => {
  if (!context.scheme_upload) {
    return;
  }
  const { record, scheme_upload } = context;
  // create folder using record id
  const folderName = record.params.id.toString();
  const extractPath = path.join('../data/pathogen_schemes', folderName);
  if (fs.existsSync(path.join('../data/pathogen_schemes', folderName))) {
    await fs.promises.rm(extractPath, { recursive: true });
  }
  await fs.promises.mkdir(extractPath, { recursive: true });
  // extract ZIP into folder named after record id
  await fs
    .createReadStream(scheme_upload.path)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise();
};

const persistExtractedSchemeSize = async (context: ActionContext) => {
  if (!context.scheme_upload) {
    return;
  }
  const size = await getFolderSize.strict(path.join('../data/pathogen_schemes', context.record.params.id.toString()));

  await context.record.update({
    scheme_size: size,
  });
};

export default handleSchemeExtraction;
