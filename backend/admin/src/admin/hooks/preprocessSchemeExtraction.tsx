import { ActionContext, ActionRequest, BaseRecord, UploadedFile, ValidationError } from 'adminjs';
import path from 'path';
import fs from 'fs';
import { isPOSTMethod } from '../admin.utils.js';
import { ViralSchemeValidator } from '../strategies/ViralSchemeValidator.js';
import { BacterialSchemeValidator } from '../strategies/BacterialSchemeValidator.js';

export const preprocessSchemeExtraction = async (request: ActionRequest, context: ActionContext) => {
  if (isPOSTMethod(request)) {
    context.scheme_upload = await validateSchemeUpload(
      request.payload.scheme_upload,
      request.payload.type,
      context.record ?? null
    );
    updateSchemeVersion(request, context);
  }
  return request;
};

const validateSchemeUpload = async (file: UploadedFile, type: string, record?: BaseRecord) => {
  if (!file) {
    if (
      record &&
      record.params &&
      fs.existsSync(path.join('../modules/sequence_analysis/schemes', record.params.id.toString()))
    ) {
      return undefined;
    }
    throw new ValidationError(
      { scheme_upload: { message: 'Scheme upload must be provided.' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new ValidationError(
      { scheme_upload: { message: 'Uploaded file is too large (max. 50 MB).' } },
      { message: 'Scheme upload is invalid' }
    );
  }
  if (file) {
    // extend by zip-compressed, x-zip-compressed?
    if (file.type !== 'application/zip') {
      throw new ValidationError(
        { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
        { message: 'Scheme upload is invalid' }
      );
    }
  }
  const validator = type === 'viral' ? new ViralSchemeValidator(file) : new BacterialSchemeValidator(file);
  validator.validateUpload();
  return validator.getValidatedZip();
};

const updateSchemeVersion = async (request: ActionRequest, context: ActionContext) => {
  if (context.scheme_upload) {
    request.payload.scheme_version = new Date();
  }
};

export default preprocessSchemeExtraction;
