import { ActionContext, ActionRequest, BaseRecord, UploadedFile, ValidationError } from 'adminjs';
import path from 'path';
import fs from 'fs';
import { ViralSchemeValidator } from '../strategies/ViralSchemeValidator.js';
import { BacterialSchemeValidator } from '../strategies/BacterialSchemeValidator.js';
import { collectValidationErrors } from '../util/error.js';
import { isPOSTMethod } from '../util/helpers.js';
import unzipper from 'unzipper';
import { ClamScan } from '../clamscan.js';
import pLimit from 'p-limit';

export const preprocessSchemeExtraction = async (request: ActionRequest, context: ActionContext) => {
  if (isPOSTMethod(request)) {
    console.log("preprocessSchemeExtraction");
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
  console.log("validateSchemeUpload");
  if (!file) {
    if (
      record &&
      record.params &&
      fs.existsSync(path.join(process.env.API_DATA_DIRECTORY, 'pathogen_schemes', record.params.id.toString()))
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
  await validateExtractedZipSizeAndScanForMalware(file);
  const validator = type === 'viral' ? new ViralSchemeValidator(file) : new BacterialSchemeValidator(file);
  try {
    await validator.validateUpload();
  } catch (error) {
    throw error;
  }
  return validator.getValidatedZip();
};

const validateExtractedZipSizeAndScanForMalware = async (file: UploadedFile) => {
  console.log("validateExtractedZipSizeAndScanForMalware");
  let extractedZipSize = 0;
  const clamScan = await ClamScan.instance();
  const zipDirectory = await unzipper.Open.file(file.path);
  for (const file of zipDirectory.files) {
    extractedZipSize += file.uncompressedSize;
    // TODO: should be 8 GB not 100MB
    if (extractedZipSize > 8 * 1024 * 1024 * 1024) {
      throw new ValidationError({
        scheme: { message: 'Extracted scheme size exceeds the allowed limit of 8 GB.' },
      });
    }
  }

  // Scanning all files concurrently is not manageble for large zips, so we limit concurrency using p-limit
  const limit = pLimit(10);
  const results = await Promise.all(
    zipDirectory.files.map((file) => limit(() => clamScan.streamIsMalicious(file.stream())))
  );
  if (results.some((result: boolean) => result)) {
    throw new ValidationError({
      scheme: { message: 'Uploaded zip contains malware.' },
    });
  }
};

const updateSchemeVersion = (request: ActionRequest, context: ActionContext) => {
  if (context.scheme) {
    request.payload.scheme_version = new Date();
  }
};

export default preprocessSchemeExtraction;
