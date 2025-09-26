import { UploadedFile } from 'adminjs';
import CustomActionRequest from '../types/CustomActionRequest.js';
import fs from 'fs';
import { ExampleDataValidator } from './ExampleDataValidator.js';

export abstract class ExampleCsvValidator extends ExampleDataValidator {
  protected fileName: string;
  protected file: UploadedFile;
  protected request: CustomActionRequest;
  protected dataStructure?: object;
  protected abstract throwException(fieldMessage: string): void;

  constructor(request: CustomActionRequest, fileName: string) {
    super(request, fileName);
  }

  public validateFile = () => {
    if (!this.file) {
      return;
    }
    const { header, data } = this.parseCSV();
    this.validateHeader(header);
    this.validateCells(data, header);
  };

  protected getValidMimetypes = () => {
    return ['text/csv'];
  };

  protected getValidExtensions = () => {
    return ['csv'];
  };

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
    let invalidColumnLabels = header.filter((columnLabel) => !validColumnLabels.includes(columnLabel));
    invalidColumnLabels = invalidColumnLabels.filter((columnLabel) => !this.validateFlexibleColumnLabel(columnLabel));
    if (invalidColumnLabels.length > 0) {
      this.throwException(
        `File contains invalid column labels: ${invalidColumnLabels.map((columnLabel) => columnLabel).join(', ')}`
      );
    }
  };

  protected validateFlexibleColumnLabel = (columnLabel: string) => {
    const flexibleColumns: any[] = Object.values(this.dataStructure).filter((column) => column.flexible);
    return flexibleColumns.some((flexibleColumn) => {
      const regex = new RegExp(`^${flexibleColumn.label}:[a-zA-Z0-9-]+$`);
      return regex.test(columnLabel);
    });
  };

  protected validateHeader(header: string[]) {
    if (!this.dataStructure) {
      return;
    }
    this.findMissingRequiredColumns(header);
    this.findInvalidColumns(header);
  }

  protected validateCells = (data: string[][], header: string[]) => {
    for (const rowIndex in data) {
      const row = data[rowIndex];
      for (const columnIndex in data[rowIndex]) {
        const columnStructure = Object.values(this.dataStructure).find(
          (column) =>
            column.label === header[columnIndex] ||
            (header[columnIndex].includes(`${column.label}:`) && column.flexible)
        );
        const cellValue = row[columnIndex];
        const regex = new RegExp(columnStructure.pattern);
        if (!regex.test(cellValue)) {
          this.throwException(
            `File contains invalid value for column "${header[columnIndex]}" in line ${parseInt(rowIndex) + 1}: "${cellValue}"`
          );
        }
      }
    }
  };
}
