export class Error {
  result = 'error';
  code = 'ERROR_UNKNOWN';
  message = 'ERROR MESSAGE';

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }

  static throwError(code: string, message: string): never {
    throw new Error(code, message);
  }
}
