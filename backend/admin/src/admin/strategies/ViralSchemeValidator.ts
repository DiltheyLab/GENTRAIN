import { UploadedFile, ValidationError } from 'adminjs';
import { SchemeValidator } from './SchemeValidator.js';
import { validateFastaFile } from '../util/Validation.js';

export class ViralSchemeValidator extends SchemeValidator {
  protected pathogenJson: any;

  constructor(file: UploadedFile) {
    super(file);
    // Get pathogen.json first to retrieve valid file names for reference and treeJson
    this.pathogenJson = this.getPathogenJson();
  }

  public validateSchemeStructure = () => {
    this.checkReferenceFastaIsValid(this.pathogenJson);
    this.checkTreeJsonExists(this.pathogenJson);
  };

  protected getValidFileNames = (): string[] => {
    return Object.values(this.pathogenJson.files);
  };

  protected getValidFileExtensions = (): string[] => {
    return [];
  };

  private getPathogenJson = () => {
    const rootFolderName = this.getRootFolderName();
    const file = rootFolderName
      ? this.zip.getEntry(`${rootFolderName}/pathogen.json`)
      : this.zip.getEntry('pathogen.json');
    if (!file) {
      throw new ValidationError(
        { scheme: { message: `Uploaded ZIP archive does not contain pathogen.json.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
    const content = file.getData().toString('utf8');
    return JSON.parse(content.toString());
  };

  private checkReferenceFastaIsValid = (pathogenJson: any) => {
    if (!pathogenJson.files.reference) {
      throw new ValidationError(
        { scheme: { message: `Uploaded ZIP archive does not contain a reference genome.` } },
        { message: 'Scheme upload is invalid' }
      );
    }
    const file = this.zip.getEntry(pathogenJson.files.reference);
    if (!file) {
      throw new ValidationError(
        { scheme: { message: `Uploaded ZIP archive does not contain ${pathogenJson.files.reference}.` } },
        { message: 'Scheme upload is invalid' }
      );
    }

    validateFastaFile(file.getData().toString('utf8'));
  };

  private checkTreeJsonExists = (pathogenJson) => {
    if (!pathogenJson.files.treeJson) {
      return;
    }
    this.checkFileExists(pathogenJson.files.treeJson);
  };
}
