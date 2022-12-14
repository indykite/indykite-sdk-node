export enum SdkErrorCode {
  SDK_CODE_1 = 1,
}

export class SdkError extends Error {
  code: SdkErrorCode;
  description: string;

  constructor(code: SdkErrorCode, message: string, description?: string) {
    super(message);
    Object.setPrototypeOf(this, SdkError.prototype);
    this.code = code;
    if (description) {
      this.description = description;
    } else {
      this.description = message;
    }
  }
}
