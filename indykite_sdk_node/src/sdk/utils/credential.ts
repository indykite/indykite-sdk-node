import { JWK } from 'jose';
import { DEFAULT_ENDPOINT } from '../utils/consts';

import { SdkErrorCode, SdkError } from '../error';
import { Utils } from '../utils/utils';

export abstract class Credential {
  static readonly DEFAULT_LIFETIME: string = '1h';

  protected endpoint: string = DEFAULT_ENDPOINT;
  privateKey: JWK;
  protected jwt?: string;
  protected expirationTime?: Date;
  protected tokenLifetime?: string;

  protected constructor(privateKey: JWK) {
    this.privateKey = privateKey;
  }

  abstract buildToken(): Promise<Credential>;

  get token(): string {
    if (this.jwt) {
      return this.jwt;
    }
    throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run buildToken() function first');
  }

  getExpirationTime(): Date {
    if (this.expirationTime) {
      return this.expirationTime;
    }
    throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run buildToken() function first');
  }

  getTokenLifetime(dateFormat = false): string | Date {
    if (this.tokenLifetime) {
      // Set default in case one is not set
      this.setTokenLifetime(Credential.DEFAULT_LIFETIME);
    }
    if (dateFormat) {
      return Utils.parseDuration(this.tokenLifetime ?? Credential.DEFAULT_LIFETIME);
    }
    return this.tokenLifetime ?? Credential.DEFAULT_LIFETIME;
  }

  protected setExpirationTime() {
    const tkLifetime = Utils.parseDuration(this.tokenLifetime ?? Credential.DEFAULT_LIFETIME);
    this.expirationTime = new Date();
    this.expirationTime.setMilliseconds(
      this.expirationTime.getMilliseconds() + tkLifetime.getMilliseconds(),
    );
    this.expirationTime.setSeconds(this.expirationTime.getSeconds() + tkLifetime.getSeconds());
    this.expirationTime.setMinutes(this.expirationTime.getMinutes() + tkLifetime.getMinutes());
    this.expirationTime.setHours(this.expirationTime.getHours() + tkLifetime.getHours());
  }

  setTokenLifetime(tokenLifetime: string) {
    Utils.parseDuration(tokenLifetime);
    this.tokenLifetime = tokenLifetime;
  }

  getEndpoint(): string {
    return this.endpoint;
  }

  withEndpoint(endpoint: string): this {
    this.endpoint = endpoint;
    return this;
  }

  withJwk(jwk: string): this {
    this.privateKey = JSON.parse(jwk);
    return this;
  }
}
