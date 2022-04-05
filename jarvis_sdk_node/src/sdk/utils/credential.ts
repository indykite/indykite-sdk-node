import { JWK, importJWK, SignJWT } from 'jose';
import { v4, validate, version } from 'uuid';
import { JARVIS_DEFAULT_ENDPOINT } from '../utils/consts';

import { SdkErrorCode, SdkError } from '../error';

export class ApplicationCredential {
  private appSpaceId: string;
  private appAgentId: string;
  private endpoint: string = JARVIS_DEFAULT_ENDPOINT;
  privateKey: JWK;
  private jwt?: string;

  private constructor(appSpaceId: string, appAgentId: string, privateKey: JWK) {
    this.appSpaceId = appSpaceId;
    this.appAgentId = appAgentId;
    this.privateKey = privateKey;
  }

  static fromString(credential: string): ApplicationCredential {
    const objectCredential = JSON.parse(credential);
    const appCredential = new ApplicationCredential(
      objectCredential.appSpaceId,
      objectCredential.appAgentId,
      objectCredential.privateKeyJWK as JWK,
    );
    if (objectCredential.endpoint) appCredential.withEndpoint(objectCredential.endpoint);
    return appCredential;
  }

  static fromBuffer(credential: Buffer): ApplicationCredential {
    return this.fromString(credential.toString());
  }

  static fromObject(credential: unknown): ApplicationCredential {
    return this.fromString(JSON.stringify(credential));
  }

  withAppSpaceId(appSpaceId: string): ApplicationCredential {
    this.appSpaceId = appSpaceId;
    return this;
  }

  withAppAgentId(appAgentId: string): ApplicationCredential {
    this.appAgentId = appAgentId;
    return this;
  }

  withEndpoint(endpoint: string): ApplicationCredential {
    this.endpoint = endpoint;
    return this;
  }

  withJwk(jwk: string): ApplicationCredential {
    this.privateKey = JSON.parse(jwk);
    return this;
  }

  private async signToken() {
    const parsedKey = await importJWK(this.privateKey);
    if (!this.privateKey.alg) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing private key algorithm');
    }
    this.jwt = await new SignJWT({})
      .setProtectedHeader({ alg: this.privateKey.alg, kid: this.privateKey.kid })
      .setIssuedAt()
      .setIssuer(this.appAgentId)
      .setAudience(this.appSpaceId)
      .setExpirationTime('1d')
      .setJti(String(v4()))
      .setSubject(this.appSpaceId)
      .sign(parsedKey);
  }

  buildToken(): Promise<ApplicationCredential> {
    return new Promise<ApplicationCredential>((resolve, reject) => {
      if (!validate(this.appSpaceId) || version(this.appSpaceId) != 4) {
        reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing or invalid format of appSpaceId'));
        return;
      }
      if (!validate(this.appAgentId) || version(this.appAgentId) != 4) {
        reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing or invalid format of appAgentId'));
        return;
      }
      this.signToken()
        .then(() => resolve(this))
        .catch((err) => reject(err));
    });
  }

  get token(): string {
    if (this.jwt) {
      return this.jwt;
    }
    throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run build() function first');
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}
