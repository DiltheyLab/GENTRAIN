import { ActionContext, UploadedFile, ValidationError } from 'adminjs';
import CustomActionRequest from '../types/CustomActionRequest.js';
import { collectValidationErrors } from '../util/Errors.js';

export abstract class ExampleDataValidator {
  protected fileName: string;
  protected file: UploadedFile;
  protected request: CustomActionRequest;
  protected dataStructure?: object;
  protected abstract getValidMimetypes(): string[];
  protected abstract getValidExtensions(): string[];
  public abstract validateFile(): void;
  protected abstract throwException(fieldMessage: string): void;

  constructor(request: CustomActionRequest, fileName: string) {
    this.request = request;
    this.file = this.request.files[`${fileName}.0`];
  }

  public validate = (context: ActionContext) => {
    if (!this.file) {
      return;
    }
    try {
      this.validateMimetype();
      this.validateFile();
    } catch (error) {
      collectValidationErrors(error, context);
    }
  };

  private validateMimetype = () => {
    const fileExtension = this.file.name.split('.').pop();

    if (!this.getValidMimetypes().includes(this.file.type) || !this.getValidExtensions().includes(fileExtension)) {
      this.throwException('File type is invalid.');
    }
  };
}
