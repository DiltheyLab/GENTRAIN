import { ActionContext, ActionRequest } from 'adminjs';
import { isPOSTMethod } from '../admin.utils.js';
import { ExampleCasesValidator } from '../strategies/ExampleCasesValidator.js';
import { ExampleContactsValidator } from '../strategies/ExampleContactsValidator.js';

interface CustomActionRequest extends ActionRequest {
  files: {
    [key: string]: {
      name: string;
      path: string;
      size: number;
      type: string;
      extension: string;
    };
  };
}

function validateCells(row) {
  for (const column in row) {
    const value = row[column];
    if (column === 'id') {
      if (!Number.isInteger(Number(value))) {
        console.log(`Invalid value in 'id' column: ${value}. Expected an integer.`);
      }
    } else if (column === 'name') {
      if (typeof value !== 'string' || value.trim() === '') {
        console.log(`Invalid value in 'name' column: ${value}. Expected a non-empty string.`);
      }
    }
  }
}

export const validateExampleDataUploads = async (request: CustomActionRequest, context: ActionContext) => {
  if (isPOSTMethod(request)) {
    const exampleCasesValidator = new ExampleCasesValidator(request);
    exampleCasesValidator.validate();
    const exampleContactsValidator = new ExampleContactsValidator(request);
    exampleContactsValidator.validate();
  }
  return request;
};

export default validateExampleDataUploads;
