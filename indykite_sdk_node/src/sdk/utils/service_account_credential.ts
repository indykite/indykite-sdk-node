import { JWK, importJWK, SignJWT } from 'jose';
import { v4 } from 'uuid';

import { SdkErrorCode, SdkError } from '../error';
import { Credential } from './credential';
import { Utils } from './utils';

export class ServiceAccountCredential extends Credential {
  serviceAccountId: string;

  private constructor(serviceAccountId: string, privateKey: JWK) {
    super(privateKey);
    this.serviceAccountId = serviceAccountId;
  }

  static fromString(credential: string): ServiceAccountCredential {
    const objectCredential = JSON.parse(credential);
    const appCredential = new ServiceAccountCredential(
      objectCredential.serviceAccountId,
      objectCredential.privateKeyJWK as JWK,
    );
    if (objectCredential.endpoint) appCredential.withEndpoint(objectCredential.endpoint);
    if (objectCredential.tokenLifetime)
      appCredential.setTokenLifetime(objectCredential.tokenLifetime);
    return appCredential;
  }

  static fromBuffer(credential: Buffer): ServiceAccountCredential {
    return this.fromString(credential.toString());
  }

  static fromObject(credential: unknown): ServiceAccountCredential {
    return this.fromString(JSON.stringify(credential));
  }

  withServiceAccountId(serviceAccountId: string): ServiceAccountCredential {
    this.serviceAccountId = serviceAccountId;
    return this;
  }

  private async signToken() {
    const parsedKey = await importJWK(this.privateKey);
    if (!this.privateKey.alg) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing private key algorithm');
    }
    if (!this.expirationTime || (new Date().getTime() >= this.expirationTime.getTime())) {
      this.setExpirationTime();
    }
    this.jwt = await new SignJWT({})
      .setProtectedHeader({ alg: this.privateKey.alg, kid: this.privateKey.kid })
      .setIssuedAt()
      .setIssuer(this.serviceAccountId)
      .setExpirationTime(Utils.dateToSeconds(this.getExpirationTime()))
      .setJti(String(v4()))
      .setSubject(this.serviceAccountId)
      .sign(parsedKey);
  }

  buildToken(): Promise<ServiceAccountCredential> {
    return new Promise<ServiceAccountCredential>((resolve, reject) => {
      this.signToken()
        .then(() => resolve(this))
        .catch((err) => reject(err));
    });
  }
}
