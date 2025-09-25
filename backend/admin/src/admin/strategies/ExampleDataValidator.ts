import { UploadedFile, ValidationError } from 'adminjs';
import CustomActionRequest from '../types/CustomActionRequest.js';
import fs from 'fs';

export abstract class ExampleDataValidator {
  protected fileName: string;
  protected file: UploadedFile;
  protected request: CustomActionRequest;
  protected dataStructure?: object;
  public abstract validate(): void;
  protected abstract throwException(fieldMessage: string): void;

  constructor(request: CustomActionRequest, fileName: string) {
    this.request = request;
    this.file = this.request.files[`${fileName}.0`];
  }

  protected parseCSV = () => {
    if (!this.file) {
      return;
    }
    const csvString = fs.readFileSync(this.file.path, 'utf-8');
    const rows = csvString.replace(/\r/g, '').trim().split('\n');
    const header = rows[0].split(';');
    const data = rows.slice(1).map((row) => row.split(';'));
    return { header, data };
  };

  protected findMissingRequiredColumns = (header: string[]) => {
    if (!this.dataStructure) {
      return;
    }
    const requiredColumns = Object.values(this.dataStructure).filter((column) => column.required);
    const missingColumns = requiredColumns.filter((column) => !header.includes(column.label));
    if (missingColumns.length > 0) {
      this.throwException(
        `File is missing required columns: ${missingColumns.map((column) => column.label).join(', ')}`
      );
    }
  };

  protected findInvalidColumns = (header: string[]) => {
    if (!this.dataStructure) {
      return;
    }
    const validColumnLabels = Object.values(this.dataStructure).map((validColumn) => validColumn.label);
    const invalidColumnLabels = header.filter((columnLabel) => !validColumnLabels.includes(columnLabel));
    if (invalidColumnLabels.length > 0) {
      // TODO: ERROR NOT SHOWN ON FIELD
      this.throwException(
        `File contains invalid column labels: ${invalidColumnLabels.map((columnLabel) => columnLabel).join(', ')}`
      );
    }
  };

  protected validateHeader(header: string[]) {
    if (!this.dataStructure) {
      return;
    }
    this.findMissingRequiredColumns(header);
    this.findInvalidColumns(header);
  }
}
