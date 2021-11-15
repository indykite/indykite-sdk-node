import { SdkErrorCode, SdkError } from '../error';

describe('SDK Error', () => {
  it('constructor with description', () => {
    try {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'MESSAGE', 'DESCRIPTION');
    } catch (error) {
      const e = error as SdkError;
      expect(e.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(e.description).toBe('DESCRIPTION');
      expect(e.message).toBe('MESSAGE');
    }
  });
  it('constructor without description', () => {
    try {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'MESSAGE');
    } catch (error) {
      const e = error as SdkError;
      expect(e.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(e.description).toBe('MESSAGE');
      expect(e.message).toBe('MESSAGE');
    }
  });
});
