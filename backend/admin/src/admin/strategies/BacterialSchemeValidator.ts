import { ValidationError } from 'adminjs';
import { SchemeValidator } from './SchemeValidator.js';
import { validateFastaFile } from '../util/Validation.js';

export class BacterialSchemeValidator extends SchemeValidator {
  public validateSchemeStructure = async () => {
    this.validateGenesList();
    this.checkFileExists('.schema_config');
    this.validateFastaFiles();
  };

  protected getValidFileNames = (): string[] => {
    return ['.genes_list', '.schema_config', 'loci_modes', 'short/self_scores'];
  };

  protected getValidFileExtensions = (): string[] => {
    return ['fa', 'mpfa', 'fna', 'fsa', 'fasta'];
  };

  private validateGenesList = () => {
    const file = this.checkFileExists('.genes_list');
    const content = file.getData().toString('utf8');
    const regex = /\b[\w\-.]+\.fasta\b/g;
    const fastaFileNames = content.match(regex) || [];
    for (const fastaFileName of fastaFileNames) {
      this.checkFileExists(fastaFileName);
    }
  };

  private validateFastaFiles = () => {
    const fastaFiles = this.zip.getEntries().filter((entry) => entry.entryName.includes('.fasta'));
    for (const fastaFile of fastaFiles) {
      validateFastaFile(fastaFile.getData().toString('utf8'));
    }
  };
}
