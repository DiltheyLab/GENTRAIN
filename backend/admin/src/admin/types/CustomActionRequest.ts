import { ActionRequest } from 'adminjs';

export default interface CustomActionRequest extends ActionRequest {
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
