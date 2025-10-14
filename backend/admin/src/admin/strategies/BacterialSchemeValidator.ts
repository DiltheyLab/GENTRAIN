import { SchemeValidator } from './SchemeValidator.js';
import { validateFastaFile, validateFilename } from '../util/validations.js';
import { ValidationError } from 'adminjs';

export class BacterialSchemeValidator extends SchemeValidator {
  public validateSchemeStructure = () => {
    this.validateGenesList();
    this.validateSchemaConfig();
    this.validateFastaFiles();
  };

  protected getValidFileNames = (): string[] => {
    return ['.genes_list', '.schema_config', 'loci_modes', 'self_scores', 'short/self_scores'];
  };

  protected getValidFileExtensions = (): string[] => {
    return ['fa', 'mpfa', 'fna', 'fsa', 'fasta'];
  };

  private validateGenesList = () => {
    const file = this.checkFileExists('.genes_list');
    const content = file.getData().toString('binary');
    //const validCharacters = /^[a-zA-Z0-9_.-]+$/;
    //content.replace(/\f/g, '').replace(' ', '')
    const regex = /\b[\w\-.]+\.fasta\b/g;
    const fastaFileNames = content.match(regex) || [];
    for (const fastaFileName of fastaFileNames) {
      this.checkFileExists(fastaFileName);
    }
  };

  private validateSchemaConfig = () => {
    const file = this.checkFileExists('.schema_config');
  };

  private validateFastaFiles = () => {
    const fastaFiles = this.zip.getEntries().filter((entry) => entry.entryName.includes('.fasta'));
    for (const fastaFile of fastaFiles) {
      // Validate filename
      // Only allow a strict regex pattern to prevent active code
      if (!validateFilename(fastaFile.entryName)) {
        this.throwException(`Invalid filename: ${fastaFile.entryName}`);
      }
      // Validate fasta content
      const validationErrors = validateFastaFile(fastaFile.getData().toString('utf8'));
      if (validationErrors.length > 0) {
        this.throwException(`Fasta file is invalid. ${validationErrors.join(', ')}.`);
      }
    }
  };
}
