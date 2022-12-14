import { JWK, importJWK, SignJWT } from 'jose';
import { v4 } from 'uuid';

import { SdkErrorCode, SdkError } from '../error';
import { Credential } from './credential';

export class ApplicationCredential extends Credential {
  appAgentId: string;

  private constructor(appAgentId: string, privateKey: JWK) {
    super(privateKey);
    this.appAgentId = appAgentId;
  }

  static fromString(credential: string): ApplicationCredential {
    const objectCredential = JSON.parse(credential);
    const appCredential = new ApplicationCredential(
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

  withAppAgentId(appAgentId: string): ApplicationCredential {
    this.appAgentId = appAgentId;
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
      .setExpirationTime('1d')
      .setJti(String(v4()))
      .setSubject(this.appAgentId)
      .sign(parsedKey);
  }

  buildToken(): Promise<ApplicationCredential> {
    return new Promise<ApplicationCredential>((resolve, reject) => {
      this.signToken()
        .then(() => resolve(this))
        .catch((err) => reject(err));
    });
  }
}
