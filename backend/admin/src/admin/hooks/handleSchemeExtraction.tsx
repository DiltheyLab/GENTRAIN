import { ActionContext, ActionRequest, ActionResponse, BaseRecord, ValidationError } from 'adminjs';
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
  if (!context.scheme) {
    return;
  }
  const { record, scheme } = context;
  // create folder using record id
  const folderName = record.params.id.toString();
  const extractPath = path.join(process.env.API_DATA_DIRECTORY, 'pathogen_schemes', folderName);
  // Prevent excessive disk space usage by keeping a puffer of 10 GB
  const availableDiskSpaceInGigabyte = await getAvailableDiskSpaceInGigabyte(record);
  if (availableDiskSpaceInGigabyte < 10) {
    throw new ValidationError({ scheme: { message: 'Scheme upload is not possible.' } });
  }
  if (fs.existsSync(extractPath)) {
    await fs.promises.rm(extractPath, { recursive: true });
  }
  await fs.promises.mkdir(extractPath, { recursive: true });

  // Extract ZIP into folder named after record id
  await fs
    .createReadStream(scheme.path)
    .pipe(unzipper.Extract({ path: extractPath }))
    .on('error', (err) => {
      throw err;
    })
    .promise();
};

const persistExtractedSchemeSize = async (context: ActionContext) => {
  if (!context.scheme) {
    return;
  }
  const size = await getFolderSize.strict(
    path.join(process.env.API_DATA_DIRECTORY, 'pathogen_schemes', context.record.params.id.toString())
  );

  await context.record.update({
    scheme_size: size,
  });
};

export const getAvailableDiskSpaceInGigabyte: (record: BaseRecord) => Promise<number> = async (record: BaseRecord) => {
  return await new Promise((resolve, reject) => {
    fs.statfs('/', (err, stats) => {
      if (err) {
        reject(err);
      } else {
        const availableDiskSpace =
          (stats.bsize * stats.bavail + Number(record.params.scheme_size)) / 1024 / 1024 / 1024; // in GB
        resolve(availableDiskSpace);
      }
    });
  });
};
