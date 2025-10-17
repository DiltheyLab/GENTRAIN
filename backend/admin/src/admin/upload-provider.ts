import path from 'path';

import fsExtra from 'fs-extra';
import { LocalProvider } from '@adminjs/upload';
import { UploadedFile } from 'adminjs';
import { API_DATA_DIRECTORY } from './constants.js';

export default class UploadProvider extends LocalProvider {
  constructor(uploadPath: string) {
    super({
      bucket: path.join(API_DATA_DIRECTORY, uploadPath),
      opts: {},
    });
  }

  // Override the upload method to prevent error when using a docker volume as upload directory
  // Issue: https://github.com/SoftwareBrothers/adminjs-upload/issues/42
  public async upload(file: UploadedFile, key: string): Promise<any> {
    const filePath = process.platform === 'win32' ? this.path(key) : this.path(key).slice(1);
    await fsExtra.mkdir(path.dirname(filePath), { recursive: true });
    await fsExtra.move(file.path, filePath, { overwrite: true });
  }
}
