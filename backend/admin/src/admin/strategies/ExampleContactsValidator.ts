import CustomActionRequest from '../types/CustomActionRequest.js';
import contactsExampleStructure from '../structures/contactsExample.json' with { type: 'json' };
import { ValidationError } from 'adminjs';
import { ExampleCsvValidator } from './ExampleCsvValidator.js';

export class ExampleContactsValidator extends ExampleCsvValidator {
  protected dataStructure = contactsExampleStructure;

  constructor(request: CustomActionRequest) {
    super(request, 'example_contacts_file');
  }

  protected throwException = (fieldMessage: string) => {
    throw new ValidationError({
      example_contacts_errors: {
        message: fieldMessage,
      },
    });
  };
}
