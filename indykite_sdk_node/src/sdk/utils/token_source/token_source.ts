import { SdkError, SdkErrorCode } from '../../error';
import { Token } from './token';
import { SdkClient } from '../../client/client';

/**
 * The TokenSource class helps to create a valid token.
 * @since 0.2.3
 * @example
 * // Using the HTTPClient
 * const tokenSource = HTTPClient.getTokenSource();
 *
 * // Token source with auto-renewing a token when the old one is going to be expired.
 * const tokenSource = TokenSource.reuseApplicationTokenSource();
 *
 * // Token source which always returns the same token. (Without the auto-renewing feature)
 * const tokenSource = TokenSource.staticApplicationTokenSource();
 */
export class TokenSource {
  private constructor(
    protected token?: Token,
    protected reusable = true,
    protected credentials?: unknown,
  ) {}

  /**
   * This function returns a TokenSource which repeatedly returns the same token as long as it's valid.
   * When the cached token is invalid, a new token is generated.
   * @since 0.2.3
   * @example
   * const tokenSource = TokenSource.reuseApplicationTokenSource();
   * const tokenObject = await tokenSource.getApplicationToken();
   * const accessToken = tokenObject.accessToken;
   */
  static reuseApplicationTokenSource(token?: Token, credentials?: unknown): TokenSource {
    return new TokenSource(token, true, credentials);
  }

  /**
   * This function returns a TokenSource that always returns the same token. Because the provided token
   * is never refreshed, staticApplicationTokenSource is only useful for tokens that never expire.
   * @since 0.2.3
   * @example
   * const tokenSource = TokenSource.reuseApplicationTokenSource();
   * const tokenObject = await tokenSource.getApplicationToken();
   * const accessToken = tokenObject.accessToken;
   */
  static staticApplicationTokenSource(token?: Token, credentials?: unknown): TokenSource {
    return new TokenSource(token, false, credentials);
  }

  /**
   * Get a token from this TokenSouce.
   * @since 0.2.3
   * @example
   * const tokenSource = TokenSource.reuseApplicationTokenSource();
   * const tokenObject = await tokenSource.getApplicationToken();
   * const accessToken = tokenObject.accessToken;
   */
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
