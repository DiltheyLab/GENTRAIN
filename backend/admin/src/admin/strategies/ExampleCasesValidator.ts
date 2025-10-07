import CustomActionRequest from '../types/CustomActionRequest.js';
import casesExampleStructure from '../structures/casesExample.json' with { type: 'json' };
import { ValidationError } from 'adminjs';
import { ExampleCsvValidator } from './ExampleCsvValidator.js';

export class ExampleCasesValidator extends ExampleCsvValidator {
  protected dataStructure = casesExampleStructure;

  constructor(request: CustomActionRequest) {
    super(request, 'example_cases_file');
  }

  protected throwException = (fieldMessage: string) => {
    throw new ValidationError({
      example_cases_errors: {
        message: fieldMessage,
      },
    });
  };
}
