import { JWK } from 'jose';
import { JARVIS_DEFAULT_ENDPOINT } from '../utils/consts';

import { SdkErrorCode, SdkError } from '../error';

export abstract class Credential {
  protected endpoint: string = JARVIS_DEFAULT_ENDPOINT;
  privateKey: JWK;
  protected jwt?: string;
  protected expirationTime?: Date;

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
