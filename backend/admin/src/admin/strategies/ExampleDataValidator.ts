import { ActionContext, UploadedFile, ValidationError } from 'adminjs';
import CustomActionRequest from '../types/CustomActionRequest.js';
import { collectValidationErrors } from '../util/error.js';
import { ClamScan } from '../clamscan.js';
import Stream from 'stream';

export abstract class ExampleDataValidator {
  protected file: UploadedFile;
  protected request: CustomActionRequest;
  protected dataStructure?: object;
  protected abstract getValidMimetypes(): string[];
  protected abstract getValidExtensions(): string[];
  public abstract validateFile(): Promise<void>;
  protected abstract throwException(fieldMessage: string): void;

  protected constructor(request: CustomActionRequest, fileName: string) {
    this.request = request;
    this.file = this.request.files[`${fileName}.0`];
  }

  public validate = async (context: ActionContext) => {
    if (!this.file) {
      return;
    }
    try {
      this.validateMimetype();
      await this.validateFile();
    } catch (error) {
      collectValidationErrors(error, context);
    }
  };

  protected scanForMalware = async (stream: Stream) => {
    const clamScan = await ClamScan.instance();
    if (await clamScan.streamIsMalicious(stream)) {
      this.throwException('Upload contains malware.');
    }
  };

  private validateMimetype = () => {
    const fileExtension = this.file.name.split('.').pop();
    if (!this.getValidMimetypes().includes(this.file.type) || !this.getValidExtensions().includes(fileExtension)) {
      this.throwException('File type is invalid.');
    }
  };
}
