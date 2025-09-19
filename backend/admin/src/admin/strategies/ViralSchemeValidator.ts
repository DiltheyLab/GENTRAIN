import { UploadedFile, ValidationError } from 'adminjs';
import { SchemeValidator } from './SchemeValidator.js';

export class ViralSchemeValidator extends SchemeValidator {
  protected pathogenJson: any;

  constructor(file: UploadedFile) {
    super(file);
    this.pathogenJson = this.getPathogenJson();
  }

  public validateSchemeStructure = async () => {
    await this.checkReferenceFastaIsValid(this.pathogenJson);
    this.checkTreeJsonExists(this.pathogenJson);
  };

  protected getValidFileNames = (): string[] => {
    console.log(Object.values(this.pathogenJson.files));
    return Object.values(this.pathogenJson.files);
  };

  protected getValidFileExtensions = (): string[] => {
    return [];
  };

  private getPathogenJson = () => {
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

  private checkReferenceFastaIsValid = async (pathogenJson) => {
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

    await this.validateFastaFile(file);
  };

  private checkTreeJsonExists = (pathogenJson) => {
    if (!pathogenJson.files.treeJson) {
      return;
    }
    this.checkFileExists(pathogenJson.files.treeJson);
  };
}
