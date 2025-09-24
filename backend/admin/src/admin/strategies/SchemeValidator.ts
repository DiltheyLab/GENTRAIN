import { BaseRecord, ParamsType, UploadedFile, ValidationError } from 'adminjs';
import AdmZip, { IZipEntry } from 'adm-zip';
import fs from 'fs';
import os from 'os';
import path from 'path';

export abstract class SchemeValidator {
  protected zip: AdmZip;

  constructor(file: UploadedFile) {
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
    } catch (err) {
      throw new ValidationError(
        { scheme_upload: { message: 'Uploaded file is not a valid ZIP archive.' } },
        { message: 'Scheme upload is invalid' }
      );
    }
  }

  public abstract validateSchemeStructure(): void;
  protected abstract getValidFileNames(): string[];
  protected abstract getValidFileExtensions(): string[];

  public getValidatedZip = () => {
    const zipBuffer = this.zip.toBuffer();
    // Create temp file from preprocessed zip to further process the zip file in adminjs
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

  public validateUpload = () => {
    this.validateAndPreprocessZipFile();
    this.validateSchemeStructure();
  };

  protected validateAndPreprocessZipFile = () => {
    const zipEntries = this.zip.getEntries();
    const rootFolderName = this.getRootFolderName();

    // Drop directories which is automatically created and their content recursively
    const preprocessedZip = new AdmZip();
    zipEntries.forEach((entry) => {
      if (
        entry.entryName.startsWith('__MACOSX/') ||
        entry.entryName.startsWith('.DS_STORE') ||
        entry.entryName.startsWith(`${rootFolderName}/pre_computed`)
      ) {
        return;
      }
      if (!entry.isDirectory) {
        // Remove the root folder prefix from the path
        const fileName = rootFolderName ? entry.entryName.replace(rootFolderName + '/', '') : entry.entryName;

        if (
          !this.getValidFileNames().includes(fileName) &&
          !this.getValidFileExtensions().includes(fileName.split('.').pop())
        ) {
          throw new ValidationError(
            { scheme_upload: { message: `Uploaded ZIP archive contains invalid files.` } },
            { message: 'Scheme upload is invalid' }
          );
        }
        preprocessedZip.addFile(fileName, entry.getData());
      }
    });
    this.zip = preprocessedZip;
  };

  public validateFastaFile = (file: IZipEntry) => {
    // Allow valid nucleotides of DNA and RNA sequences
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

  protected getRootFolderName = (): string | null => {
    const zipEntries = this.zip.getEntries();
    const rootFolderEntry = zipEntries.find((entry) => {
      // Entry is a directory and has no parent (only one segment)
      return entry.isDirectory && entry.entryName.replace(/\/$/, '').split('/').length === 1;
    });
    return rootFolderEntry ? rootFolderEntry.entryName.replace(/\/$/, '') : null;
  };

  protected checkFileExists = (name: string) => {
    const file = this.zip.getEntry(name);
    if (!file) {
      throw new ValidationError(
        { scheme_upload: { message: `Uploaded ZIP archive does not contain ${name}.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
    return file;
  };
}
