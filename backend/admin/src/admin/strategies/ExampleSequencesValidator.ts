import { UploadedFile, ValidationError } from 'adminjs';
import CustomActionRequest from '../types/CustomActionRequest.js';
import { ExampleDataValidator } from './ExampleDataValidator.js';
import fs from 'fs';
import { validateFastaFile, validateFilename } from '../util/validations.js';
import AdmZip from 'adm-zip';
import { Readable } from 'stream';

export class ExampleSequencesValidator extends ExampleDataValidator {
  protected pathogenType: 'bacterial' | 'viral';
  protected file: UploadedFile;
  protected request: CustomActionRequest;

  constructor (request: CustomActionRequest, pathogenType: 'bacterial' | 'viral') {
    super(request, 'example_sequences_file');
    this.pathogenType = pathogenType;
  }

  protected getValidMimetypes = () => {
    return this.pathogenType === 'bacterial'
      ? ['application/zip']
      : ['application/octet-stream', 'text/x-fasta', 'application/x-fasta', 'chemical/x-fasta'];
  };

  protected getValidExtensions = () => {
    return this.pathogenType === 'bacterial' ? ['zip'] : ['fa', 'mpfa', 'fna', 'fsa', 'fasta'];
  };

  public validateFile = async () => {
    if (!this.file) {
      return;
    }

    if (this.pathogenType === 'bacterial') {
      const validationErrors = await this.validateZipFile();
      if (Object.keys(validationErrors).length > 0) {
        this.throwException(
          `${Object.keys(validationErrors).map(
            (fileName: string) => `File "${fileName}" is invalid. ${validationErrors[fileName].join(', ')}.`
          )}`
        );
      }
    } else {
      await this.scanForMalware(fs.createReadStream(this.file.path));
      const validationErrors = validateFastaFile(this.parseFasta());
      if (validationErrors.length > 0) {
        this.throwException(`Fasta file is invalid. ${validationErrors.join(', ')}.`);
      }
    }
  };

  protected parseFasta = () => {
    return fs.readFileSync(this.file.path, 'utf-8');
  };

  protected validateZipFile = async () => {
    const validationErrors = {};
    let zip = null;
    try {
      zip = new AdmZip(this.file.path);
    } catch (err) {
      this.throwException('Uploaded file is not a valid ZIP archive.');
    }
    const files = zip.getEntries();
    // Only allow fasta files at root level of the zip archive
    const invalidEntries = files.filter(
      entry =>
        !['fa', 'mpfa', 'fna', 'fsa', 'fasta'].some(extension => entry.entryName.includes(extension)) ||
        entry.entryName.includes('/')
    );
    if (invalidEntries.length > 0) {
      this.throwException(
        `Zip contains invalid entries: ${invalidEntries.map(invalidFile => invalidFile.entryName).join(', ')}.`
      );
    }

    for (const fastaFile of files) {
      if (!validateFilename(fastaFile.entryName)) {
        this.throwException(`Invalid filename: ${fastaFile.entryName}`);
      }
      await this.scanForMalware(Readable.from(fastaFile.getData()));

      const fileErrors = validateFastaFile(fastaFile.getData().toString('utf8'));
      if (fileErrors.length > 0) {
        validationErrors[fastaFile.entryName] = fileErrors;
      }
    }

    return validationErrors;
  };

  protected throwException = (fieldMessage: string) => {
    throw new ValidationError({
      example_sequences_errors: {
        message: fieldMessage,
      },
    });
  };
}
