import { ActionContext, ActionRequest } from 'adminjs';
import { isPOSTMethod } from '../admin.utils.js';
import { ExampleCasesValidator } from '../strategies/ExampleCasesValidator.js';
import { ExampleContactsValidator } from '../strategies/ExampleContactsValidator.js';
import { ExampleSequencesValidator } from '../strategies/ExampleSequencesValidator.js';

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

export const validateExampleDataUploads = async (request: CustomActionRequest, context: ActionContext) => {
  if (isPOSTMethod(request)) {
    const exampleCasesValidator = new ExampleCasesValidator(request);
    exampleCasesValidator.validate(context);
    const exampleContactsValidator = new ExampleContactsValidator(request);
    exampleContactsValidator.validate(context);
    const exampleSequencesValidator = new ExampleSequencesValidator(request, request.payload.type);
    exampleSequencesValidator.validate(context);
  }
  return request;
};

export default validateExampleDataUploads;
