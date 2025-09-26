import { ActionContext, UploadedFile } from 'adminjs';
import CustomActionRequest from '../types/CustomActionRequest.js';
import { collectValidationErrors } from '../util/Errors.js';

export abstract class ExampleDataValidator {
  protected fileName: string;
  protected file: UploadedFile;
  protected request: CustomActionRequest;
  protected dataStructure?: object;
  public abstract validateFile(): void;
  protected abstract throwException(fieldMessage: string): void;

  constructor(request: CustomActionRequest, fileName: string) {
    this.request = request;
    this.file = this.request.files[`${fileName}.0`];
  }

  public validate = (context: ActionContext) => {
    try {
      this.validateFile();
    } catch (error) {
      collectValidationErrors(error, context);
    }
  };
}
