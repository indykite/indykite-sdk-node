export enum SdkErrorCode {
  SDK_CODE_1 = 1,
  SDK_CODE_2 = 2,
  SDK_CODE_3 = 3,
  SDK_CODE_4 = 4,
  SDK_CODE_5 = 5,
  SDK_CODE_6 = 6,
  SDK_CODE_7 = 7,
  SDK_CODE_8 = 8,
}

export class SkdErrorText {
  static SDK_CODE_1 = (s: string) => `Can't deserialize ${s}.`;
  static SDK_CODE_2 = (classname: string, param?: string) =>
    `Can't unmarshal ${classname}: ${param}.`;
  static SDK_CODE_3 = (s: string) => `No ${s} response.`;
  static SDK_CODE_4 = (id1: string, id2: string | undefined) =>
    `Update returned with different id: request.id=${id1}, response.id=${id2 ?? 'undefined'}.`;
  static SDK_CODE_5 = (s: string) => `No data in ${s} response`;
  static SDK_CODE_6 = (s: string) => `No ${s} record response`;
  static SDK_CODE_7 = (s: string) => `You cannot have ${s} `;
  static SDK_CODE_8 = (s: string) => `Missing parameter: ${s} `;
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
