import { ExampleDataValidator } from './ExampleDataValidator.js';
import CustomActionRequest from '../types/CustomActionRequest.js';
import contactsExampleStructure from '../structures/contactsExample.json' with { type: 'json' };
import { ValidationError } from 'adminjs';

export class ExampleContactsValidator extends ExampleDataValidator {
  protected dataStructure = contactsExampleStructure;

  constructor(request: CustomActionRequest) {
    super(request, 'example_contacts_file');
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
        example_contacts_errors: {
          message: fieldMessage,
        },
      },
      { message: 'Contacts example upload is invalid' }
    );
  };
}
