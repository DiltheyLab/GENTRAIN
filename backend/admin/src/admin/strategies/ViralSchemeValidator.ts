import { ValidationError } from 'adminjs';
import { SchemeValidator } from './SchemeValidator.js';

export class ViralSchemeValidator extends SchemeValidator {
  public validateSchemeStructure = async () => {
    const pathogenJson = await this.getPathogenJson();
    this.checkReferenceFastaIsValid(pathogenJson);
    this.checkTreeJsonIsValid(pathogenJson);
    this.findInvalidFiles(Object.values(pathogenJson.files));
  };

  private findInvalidFiles = (validFileNames: string[]) => {
    const zipEntries = this.zip.getEntries();
    const invalidFiles = zipEntries.filter((entry) => !validFileNames.includes(entry.entryName));
    if (invalidFiles && invalidFiles.length > 0) {
      console.log(invalidFiles);
      throw new ValidationError(
        { scheme_upload: { message: `Uploaded ZIP archive contains invalid files.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
  };

  private getPathogenJson = async () => {
    const file = this.zip.getEntry('pathogen.json');
    if (!file) {
      throw new ValidationError(
        { scheme_upload: { message: `Uploaded ZIP archive does not contain pathogen.json.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
    const content = file.getData().toString('utf8');
    return JSON.parse(content.toString());
  };

  private checkReferenceFastaIsValid = (pathogenJson) => {
    if (!pathogenJson.files.reference) {
      throw new ValidationError(
        { scheme_upload: { message: `Uploaded ZIP archive does not contain a reference genome.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
    const file = this.zip.getEntry(pathogenJson.files.reference);
    if (!file) {
      throw new ValidationError(
        { scheme_upload: { message: `Uploaded ZIP archive does not contain ${pathogenJson.files.reference}.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
  };

  private checkTreeJsonIsValid = (pathogenJson) => {
    if (!pathogenJson.files.treeJson) {
      return;
    }
    const file = this.zip.getEntry(pathogenJson.files.treeJson);
    if (!file) {
      throw new ValidationError(
        { scheme_upload: { message: `Uploaded ZIP archive does not contain ${pathogenJson.files.treeJson}.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
  };
}
