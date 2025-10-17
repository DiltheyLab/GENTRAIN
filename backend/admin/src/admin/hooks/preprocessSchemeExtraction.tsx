import { ActionContext, ActionRequest, BaseRecord, UploadedFile, ValidationError } from 'adminjs';
import path from 'path';
import fs from 'fs';
import { ViralSchemeValidator } from '../strategies/ViralSchemeValidator.js';
import { BacterialSchemeValidator } from '../strategies/BacterialSchemeValidator.js';
import { collectValidationErrors } from '../util/error.js';
import { isPOSTMethod } from '../util/helpers.js';
import unzipper from 'unzipper';
import { on } from 'events';

export const preprocessSchemeExtraction = async (request: ActionRequest, context: ActionContext) => {
  if (isPOSTMethod(request)) {
    try {
      context.scheme = await validateSchemeUpload(request.payload.scheme, request.payload.type, context.record ?? null);
    } catch (error) {
      collectValidationErrors(error, context);
    }
    updateSchemeVersion(request, context);
  }
  return request;
};

const validateSchemeUpload = async (file: UploadedFile, type: string, record?: BaseRecord) => {
  if (!file) {
    if (
      record &&
      record.params &&
      fs.existsSync(path.join(process.env.ADMIN_DATA_DIRECTORY, 'pathogen_schemes', record.params.id.toString()))
    ) {
      return undefined;
    }
    throw new ValidationError(
      { scheme: { message: 'Scheme upload must be provided.' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  // Zip file must be smaller than 300 MB
  if (file.size > 300 * 1024 * 1024) {
    throw new ValidationError(
      { scheme: { message: 'Uploaded file is too large (max. 300 MB).' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  // Extracted zip size must be smaller than 8 GB
  await validateExtractedZipSize(file);
  const validator = type === 'viral' ? new ViralSchemeValidator(file) : new BacterialSchemeValidator(file);
  try {
    validator.validateUpload();
  } catch (error) {
    throw error;
  }
  return validator.getValidatedZip();
};

const validateExtractedZipSize = async (file: UploadedFile) => {
  let extractedZipSize = 0;
  try {
    await fs
      .createReadStream(file.path)
      .pipe(unzipper.Parse())
      // Sum up the size of all extracted files
      .on('entry', (entry: unzipper.Entry) => {
        entry.on('data', (chunk: Buffer) => {
          extractedZipSize += chunk.length;
        });
        if (extractedZipSize > 0.1 * 1024 * 1024 * 1024) {
          throw new ValidationError({
            scheme: { message: 'Extracted scheme size exceeds the allowed limit of 8 GB.' },
          });
        }
      })
      .promise();
  } catch (error) {
    throw error;
  }
};

const updateSchemeVersion = (request: ActionRequest, context: ActionContext) => {
  if (context.scheme) {
    request.payload.scheme_version = new Date();
  }
};

export default preprocessSchemeExtraction;
