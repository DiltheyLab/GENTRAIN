import { ExampleDataValidator } from './ExampleDataValidator.js';
import CustomActionRequest from '../types/CustomActionRequest.js';
import casesExampleStructure from '../structures/casesExample.json' with { type: 'json' };
import { ValidationError } from 'adminjs';

export class ExampleCasesValidator extends ExampleDataValidator {
  protected dataStructure = casesExampleStructure;

  constructor(request: CustomActionRequest) {
    super(request, 'example_cases_file');
  }

  public validate = () => {
    if (!this.file) {
      return;
    }
    const { header, data } = this.parseCSV();
    this.validateHeader(header);
  };

  protected throwException = (fieldMessage: string) => {
    throw new ValidationError(
      {
        example_cases_errors: {
          message: fieldMessage,
        },
      },
      { message: 'Cases example upload is invalid' }
    );
  };
}
