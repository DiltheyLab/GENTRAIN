import { UploadedFile, ValidationError } from 'adminjs';
import AdmZip, { IZipEntry } from 'adm-zip';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ClamScan } from '../clamscan.js';
import { Readable } from 'stream';

export abstract class SchemeValidator {
  protected zip: AdmZip;
  protected validMimetypes = ['application/zip', 'application/zip-compressed', 'application/x-zip-compressed'];

  constructor(file: UploadedFile) {
    if (file) {
      if (!this.validMimetypes.includes(file.type)) {
        this.throwException('Uploaded file is not a valid ZIP archive.');
      }
    }
    try {
      this.zip = new AdmZip(file.path);
    } catch (err) {
      this.throwException('Uploaded file is not a valid ZIP archive.');
    }
  }

  public abstract validateSchemeStructure(): void | Promise<void>;
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

  public validateUpload = async () => {
    this.validateAndPreprocessZipFile();
    await this.validateSchemeStructure();
  };

  protected scanZipEntryForMalware = async (fileToScan: IZipEntry) => {
    const clamScan = await ClamScan.instance();
    const fileStream = Readable.from(fileToScan.getData());
    if (await clamScan.streamIsMalicious(fileStream)) {
      this.throwException(`Uploaded ZIP archive contains malware.`);
    }
  };

  protected validateAndPreprocessZipFile = () => {
    const zipEntries = this.zip.getEntries();
    const rootFolderName = this.getRootFolderName();
    // Drop directories which is automatically created and their content recursively
    const preprocessedZip = new AdmZip();
    zipEntries.forEach((entry) => {
      if (
        entry.entryName.startsWith('__MACOSX/') ||
        entry.entryName.startsWith('.DS_Store') ||
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
          this.throwException(`Uploaded ZIP archive contains invalid file: ${fileName}`);
        }
        preprocessedZip.addFile(fileName, entry.getData());
      }
    });
    this.zip = preprocessedZip;
  };

  protected getRootFolderName = (): string | null => {
    const zipEntries = this.zip.getEntries();
    const rootFolderEntry = zipEntries.find((entry) => {
      // Entry is a directory and has no parent (only one segment)
      const isRootDirectory = entry.isDirectory && entry.entryName.replace(/\/$/, '').split('/').length === 1;
      if (!isRootDirectory) {
        return false;
      }
      const rootDirectory = entry.entryName;
      // Return as root directory if all entries (auto generated filed excluded) start with the directory name
      return (
        zipEntries.find(
          (entry) =>
            !entry.entryName.startsWith(`${rootDirectory}`) &&
            !entry.entryName.startsWith('.DS_Store') &&
            !entry.entryName.startsWith('__MACOSX/')
        ) === undefined
      );
    });
    return rootFolderEntry ? rootFolderEntry.entryName.replace(/\/$/, '') : null;
  };

  protected checkFileExists = (name: string) => {
    const file = this.zip.getEntry(name);
    if (!file) {
      this.throwException(`Uploaded ZIP archive does not contain ${name}.`);
    }
    return file;
  };

  protected throwException = (fieldMessage: string) => {
    throw new ValidationError({
      scheme: {
        message: fieldMessage,
      },
    });
  };
}
