import { UploadedFile, ValidationError } from 'adminjs';
import { SchemeValidator } from './SchemeValidator.js';
import { validateFastaFile, validateJsonFile } from '../util/validations.js';

export class ViralSchemeValidator extends SchemeValidator {
  protected pathogenJson: any;

  constructor(file: UploadedFile) {
    super(file);
    // Get pathogen.json first to retrieve valid file names for reference and treeJson
    this.pathogenJson = this.validateAndGetPathogenJson();
  }

  public validateSchemeStructure = () => {
    this.checkReferenceFastaIsValid(this.pathogenJson);
    this.checkTreeJsonIsValid(this.pathogenJson);
  };

  protected getValidFileNames = (): string[] => {
    return ['pathogen.json', 'reference.fasta', 'tree.json'];
  };

  protected getValidFileExtensions = (): string[] => {
    return [];
  };

  private validateAndGetPathogenJson = () => {
    const rootFolderName = this.getRootFolderName();
    const file = rootFolderName
      ? this.zip.getEntry(`${rootFolderName}/pathogen.json`)
      : this.zip.getEntry('pathogen.json');
    if (!file) {
      this.throwException(`Uploaded ZIP archive does not contain pathogen.json.`);
    }
    const content = file.getData().toString('utf8');
    if (!validateJsonFile(content.toString())) {
      this.throwException(`pathogen.json contains invalid json.`);
    }
    return JSON.parse(content.toString());
  };

  private checkReferenceFastaIsValid = (pathogenJson: any) => {
    if (!pathogenJson.files.reference || pathogenJson.files.reference !== 'reference.fasta') {
      this.throwException(`Invalid reference (reference.fasta) in pathogen.json.`);
    }
    const file = this.zip.getEntry(pathogenJson.files.reference);
    if (!file) {
      this.throwException(`Uploaded ZIP archive does not contain ${pathogenJson.files.reference}.`);
    }

    const validationErrors = validateFastaFile(file.getData().toString('utf8'));
    if (validationErrors.length > 0) {
      this.throwException(`reference.fasta is invalid: ${validationErrors.join(', ')}.`);
    }
  };

  private checkTreeJsonIsValid = (pathogenJson) => {
    if (!pathogenJson.files.treeJson) {
      return;
    }
    if (pathogenJson.files.treeJson !== 'tree.json') {
      this.throwException(`Invalid treeJson (tree.json) in pathogen.json.`);
    }
    this.checkFileExists(pathogenJson.files.treeJson);
    const file = this.zip.getEntry(pathogenJson.files.treeJson);
    if (!validateJsonFile(file.getData().toString('utf8'))) {
      this.throwException(`tree.json contains invalid json.`);
    }
  };
}
