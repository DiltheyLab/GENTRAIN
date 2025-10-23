import { SchemeValidator } from './SchemeValidator.js';
import { validateFastaFile, validateFilename } from '../util/validations.js';

export class BacterialSchemeValidator extends SchemeValidator {
  public validateSchemeStructure = async () => {
    await this.validateGenesList();
    await this.validateSchemaConfig();
    this.validateFastaFiles();
  };

  protected getValidFileNames = (): string[] => {
    // Accept only the very necessary files
    // pre_computed folder is also valid but hard to validate
    // and safely generated during first usage of the scheme
    return ['.genes_list', '.schema_config', 'loci_modes', 'self_scores', 'short/self_scores'];
  };

  protected getValidFileExtensions = (): string[] => {
    // Fasta files may contain different file extensions
    return ['fa', 'mpfa', 'fna', 'fsa', 'fasta'];
  };

  private validateGenesList = async () => {
    const file = this.checkFileExists('.genes_list');
    const content = file.getData().toString('binary');
    const regex = /\b[\w\-.]+\.fasta\b/g;
    // Validate fasta files from .genes_list exist within the zip
    const fastaFileNames = content.match(regex) || [];
    for (const fastaFileName of fastaFileNames) {
      this.checkFileExists(fastaFileName);
    }
    // As .genes_list does not provide an established content structure we check for malware using clamav
    await this.scanZipEntryForMalware(file);
  };

  private validateSchemaConfig = async () => {
    const file = this.checkFileExists('.schema_config');
    // As .schema_config does not provide an established content structure we check for malware using clamav
    await this.scanZipEntryForMalware(file);
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
