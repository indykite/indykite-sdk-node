export enum SdkErrorCode {
  SDK_CODE_1 = 1,
  SDK_CODE_2 = 2,
  SDK_CODE_3 = 3,
  SDK_CODE_4 = 4,
  SDK_CODE_5 = 5,
}

export class SkdErrorText {
  static SDK_CODE_1 = (s: string) => `Can't deserialize ${s}.`;
  static SDK_CODE_2 = (classname: string, param?: string) =>
    `Can't unmarshal ${classname}: ${param}.`;
  static SDK_CODE_3 = (s: string) => `No ${s} response.`;
  static SDK_CODE_4 = (id1: string, id2: string | undefined) =>
    `Update returned with different id: request.id=${id1}, response.id=${id2 ?? 'undefined'}.`;
  static SDK_CODE_5 = (s: string) => `No data in ${s} response`;
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
