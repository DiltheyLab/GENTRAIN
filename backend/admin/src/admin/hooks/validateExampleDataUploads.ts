import { ActionContext, ActionRequest } from 'adminjs';
import { ExampleCasesValidator } from '../strategies/ExampleCasesValidator.js';
import { ExampleContactsValidator } from '../strategies/ExampleContactsValidator.js';
import { ExampleSequencesValidator } from '../strategies/ExampleSequencesValidator.js';
import { isPOSTMethod } from '../util/helpers.js';

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
    await exampleCasesValidator.validate(context);
    const exampleContactsValidator = new ExampleContactsValidator(request);
    await exampleContactsValidator.validate(context);
    const exampleSequencesValidator = new ExampleSequencesValidator(request, request.payload.type);
    await exampleSequencesValidator.validate(context);
  }
  return request;
};

export default validateExampleDataUploads;
