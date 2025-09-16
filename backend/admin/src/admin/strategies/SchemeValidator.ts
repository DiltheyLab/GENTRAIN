import { BaseRecord, ParamsType, UploadedFile, ValidationError } from 'adminjs';
import AdmZip from 'adm-zip';
import fs from 'fs';
import os from 'os';
import path from 'path';

export abstract class SchemeValidator {
  protected zip: AdmZip;
  protected params: ParamsType;

  public abstract validateSchemeStructure(): void;

  constructor(record: BaseRecord) {
    this.params = record.params;
  }

  public getValidatedZip = async () => {
    const zipBuffer = this.zip.toBuffer();
    const arrayBuffer = zipBuffer.buffer.slice(
      zipBuffer.byteOffset,
      zipBuffer.byteOffset + zipBuffer.byteLength
    ) as ArrayBuffer;
    const file = new File([arrayBuffer], 'output.zip', { type: 'application/zip' });
    const buffer = Buffer.from(arrayBuffer);
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}.zip`);
    fs.writeFileSync(tempFilePath, zipBuffer);
    return {
      name: file.name,
      type: file.type,
      size: buffer.length,
      buffer: buffer,
      path: tempFilePath,
    };
  };

  public validateUpload = async (file: UploadedFile) => {
    await this.validateZipFile(file);
    await this.validateSchemeStructure();
  };

  protected validateZipFile = async (file: UploadedFile) => {
    if (file) {
      if (file.type !== 'application/zip') {
        throw new ValidationError(
          { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
          { message: 'Scheme upload is invalid' }
        );
      }
    }
    try {
      this.zip = new AdmZip(file.path);
      const zipEntries = this.zip.getEntries();

      // Drop directories which is automatically created and their content recursively
      zipEntries.forEach((entry) => {
        if (entry.entryName.startsWith('__MACOSX/') || entry.entryName.startsWith('.DS_STORE')) {
          this.zip.deleteFile(entry.entryName);
        }
      });

      const files = zipEntries.filter((entry) => !entry.isDirectory);
      if (!files || files.length === 0) {
        throw new ValidationError(
          { scheme_upload: { message: 'Uploaded ZIP archive is empty.' } },
          { message: 'Scheme upload is invalid' }
        );
      }
    } catch (err) {
      throw new ValidationError(
        { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
        { message: 'Scheme upload is invalid' }
      );
    }
  };
}
