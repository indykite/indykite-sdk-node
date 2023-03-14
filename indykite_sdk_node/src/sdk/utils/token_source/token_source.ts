import { SdkError, SdkErrorCode } from '../../error';
import { Token } from './token';
import { SdkClient } from '../../client/client';

export class TokenSource {
  private constructor(
    protected token?: Token,
    protected reusable = true,
    protected credentials?: unknown,
  ) {}

  static reuseApplicationTokenSource(token?: Token, credentials?: unknown): TokenSource {
    return new TokenSource(token, true, credentials);
  }

  static staticApplicationTokenSource(token?: Token, credentials?: unknown): TokenSource {
    return new TokenSource(token, false, credentials);
  }

  async getApplicationToken(): Promise<Token> {
    if (!this.token) {
      if (this.reusable) {
        this.token = await SdkClient.buildApplicationCredentialToken();
      } else {
        throw new SdkError(SdkErrorCode.SDK_CODE_1, 'HTTP Client has no generated token');
      }
    }

    if (!this.token.valid() && this.reusable) {
      this.token = await SdkClient.buildApplicationCredentialToken();
    }

    return this.token;
  }
}
