import { BaseRecord, ParamsType, UploadedFile, ValidationError } from 'adminjs';
import AdmZip, { IZipEntry } from 'adm-zip';
import fs from 'fs';
import os from 'os';
import path from 'path';

export abstract class SchemeValidator {
  protected zip: AdmZip;

  public abstract validateSchemeStructure(): void;

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

  public validateFastaFile = async (file: IZipEntry) => {
    const alphabet = /^[ACGTN]+$/i;
    const fastaString = file.getData().toString('utf8');
    const lines = fastaString.trim().split(/\r?\n/);
    let errors = [];
    let hasSequence = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('>')) {
        // Validate header line
        const header = line.slice(1).trim();
        const [id, ...desc] = header.split(/\s+/);
        if (!/^[A-Za-z0-9._-]+$/.test(id)) {
          errors.push(`Line ${i + 1}: Sequence id is invalid`);
        }
        if (desc.join(' ').match(/[^\x20-\x7E]/)) {
          errors.push(`Line ${i + 1}: Non-ASCII characters in sequence description`);
        }
        hasSequence = false;
      } else {
        // Validate non header line
        if (!alphabet.test(line)) {
          errors.push(`Line ${i + 1}: Invalid characters in sequence`);
        }
        hasSequence = true;
      }
    }
    if (!hasSequence) {
      errors.push('Last header has no sequence');
    }
    if (errors.length > 0) {
      throw new ValidationError(
        { scheme_upload: { message: `${file.entryName} is invalid: ${errors.join(', ')}.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
  };
}
