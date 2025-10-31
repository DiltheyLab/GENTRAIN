import { ActionContext, ActionRequest, BaseRecord, UploadedFile, ValidationError } from 'adminjs';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { ViralSchemeValidator } from '../strategies/ViralSchemeValidator.js';
import { BacterialSchemeValidator } from '../strategies/BacterialSchemeValidator.js';
import { collectValidationErrors } from '../util/error.js';
import { isPOSTMethod } from '../util/helpers.js';
import unzipper from 'unzipper';
import { ClamScan } from '../clamscan.js';
import pLimit from 'p-limit';

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
  await validateExtractedZipSize(file);
  await scanForMalware(file);
  const validator = type === 'viral' ? new ViralSchemeValidator(file) : new BacterialSchemeValidator(file);
  try {
    await validator.validateUpload();
  } catch (error) {
    throw error;
  }
  return validator.getValidatedZip();
};

const validateExtractedZipSize = async (file: UploadedFile) => {
  const zipDirectory = await unzipper.Open.file(file.path);
  // Each upload should reuse an existing clamscan singleton object
  let extractedZipSize = 0;
  for (const file of zipDirectory.files) {
    extractedZipSize += file.uncompressedSize;
    // Zips leading to extracted directory sizes larger than 8 GB are not allowed
    // to prevent zip bombs and disk storage overload
    if (extractedZipSize > 8 * 1024 * 1024 * 1024) {
      throw new ValidationError({
        scheme: { message: 'Extracted scheme size exceeds the allowed limit of 8 GB.' },
      });
    }
  }
};

const scanForMalware = async (file: UploadedFile) => {
  const zipDirectory = await unzipper.Open.file(file.path);
  // Scanning all files concurrently is not manageable for large zips, so we limit concurrency using p-limit
  // The concurrency limit is calculated based on the currently available RAM (20 scans per 1 GB RAM)
  const clamScan = await ClamScan.instance();
  const availableRam = (Math.floor(os.freemem() / (1024 ** 3)));
  const limitBasedOnAvailableRam = Math.max(1, 10 * availableRam);
  const limit = pLimit(limitBasedOnAvailableRam);
  const results = await Promise.all(
    zipDirectory.files.map((file) => limit(() => clamScan.streamIsMalicious(file.stream())))
  );
  // Throw an exception if at least one file is infected
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
