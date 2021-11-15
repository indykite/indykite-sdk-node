import {
  ChangePasswordRequest,
  CheckConsentChallengeRequest,
  CreateConsentVerifierRequest,
  DeleteDigitalTwinRequest,
  DigitalTwinIdentifier,
  GetDigitalTwinRequest,
  IdentityManagementAPIClient,
  PatchDigitalTwinRequest,
  StartDigitalTwinEmailVerificationRequest,
  StartForgottenPasswordFlowRequest,
  TokenIntrospectRequest,
  VerifyDigitalTwinEmailRequest,
} from '../grpc/indykite/identity/v1beta1/identity_management_api';
import { DigitalTwin, IdentityTokenInfo } from '../grpc/indykite/identity/v1beta1/model';
import * as sdkTypes from './model';
import { MapValue } from '../grpc/indykite/objects/v1beta1/struct';

import { SdkErrorCode, SdkError } from './error';
import { Utils } from './utils/utils';
import { ConsentChallenge, ConsentChallengeDenial, PatchResult, Property } from './model';
import { SdkClient } from './client/client';

export class IdentityClient {
  private client: IdentityManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as IdentityManagementAPIClient;
  }

  /**
   * @decrecated Use createInstance instead
   * @param token
   * @returns
   */
  static newClient(token?: string | unknown): Promise<IdentityClient> {
    return this.createInstance(token);
  }

  static createInstance(token?: string | unknown): Promise<IdentityClient> {
    return new Promise<IdentityClient>((resolve, reject) => {
      SdkClient.createServiceInstance(IdentityManagementAPIClient, token)
        .then((sdk) => {
          resolve(new IdentityClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  introspectToken(token: string): Promise<sdkTypes.TokenInfo> {
    // Build request message
    const request = TokenIntrospectRequest.fromJSON({ token });

    // Invoke the RPC
    return new Promise<sdkTypes.TokenInfo>((resolve, reject) => {
      this.client.tokenIntrospect(request, (err, response) => {
        if (err) reject(err);
        try {
          resolve(sdkTypes.TokenInfo.deserialize(response));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  getDigitalTwin(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
    properties: string[],
  ): Promise<{ digitalTwin?: sdkTypes.DigitalTwin; tokenInfo?: sdkTypes.TokenInfo }> {
    const dtId = Utils.uuidToBuffer(digitalTwinId);
    const tId = Utils.uuidToBuffer(tenantId);
    const request = GetDigitalTwinRequest.fromJSON({
      id: Utils.createDigitalTwinId(dtId, tId),
      properties: Property.fromPropertiesList(properties),
    });

    return new Promise((resolve, reject) => {
      this.client.getDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          try {
            const dtResponse: {
              digitalTwin?: sdkTypes.DigitalTwin;
              tokenInfo?: sdkTypes.TokenInfo;
            } = {};
            if (response.digitalTwin) {
              dtResponse.digitalTwin = sdkTypes.DigitalTwin.deserialize(response);
            }

            if (response.tokenInfo) {
              dtResponse.tokenInfo = sdkTypes.TokenInfo.deserialize(
                response.tokenInfo as IdentityTokenInfo,
              );
            }
            resolve(dtResponse);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  getDigitalTwinByToken(
    token: string,
    properties: string[],
  ): Promise<{ digitalTwin?: sdkTypes.DigitalTwin; tokenInfo?: sdkTypes.TokenInfo }> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = GetDigitalTwinRequest.fromJSON({
      id: Utils.createDigitalTwinIdFromToken(token),
      properties: Property.fromPropertiesList(properties),
    });

    return new Promise((resolve, reject) => {
      this.client.getDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          try {
            const dtResponse: {
              digitalTwin?: sdkTypes.DigitalTwin;
              tokenInfo?: sdkTypes.TokenInfo;
            } = {};
            if (response.digitalTwin) {
              dtResponse.digitalTwin = sdkTypes.DigitalTwin.deserialize(response);
            }

            if (response.tokenInfo) {
              dtResponse.tokenInfo = sdkTypes.TokenInfo.deserialize(
                response.tokenInfo as IdentityTokenInfo,
              );
            }
            resolve(dtResponse);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  private patch(request: PatchDigitalTwinRequest): Promise<PatchResult[]> {
    return new Promise((resolve, reject) => {
      this.client.patchDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.result) {
            resolve(response.result.map((result) => PatchResult.deserialize(result)));
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing patch response'));
          }
        }
      });
    });
  }

  patchProperties(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
    dt: sdkTypes.DigitalTwin,
    forceDelete = false,
  ): Promise<PatchResult[]> {
    const patchdt = DigitalTwin.fromJSON({});
    patchdt.id = Utils.uuidToBuffer(digitalTwinId);
    patchdt.tenantId = Utils.uuidToBuffer(tenantId);

    const dti = DigitalTwinIdentifier.fromJSON({
      digitalTwin: DigitalTwin.toJSON(patchdt),
    });

    const request = PatchDigitalTwinRequest.fromJSON({
      id: DigitalTwinIdentifier.toJSON(dti),
      forceDelete,
    });
    request.operations = dt.getPatchOperationsAndReset();
    return this.patch(request);
  }

  patchPropertiesByToken(
    token: string,
    dt: sdkTypes.DigitalTwin,
    forceDelete = false,
  ): Promise<PatchResult[]> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = PatchDigitalTwinRequest.fromJSON({
      id: Utils.createDigitalTwinIdFromToken(token),
      forceDelete,
    });
    request.operations = dt.getPatchOperationsAndReset();
    return this.patch(request);
  }

  startEmailVerification(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
    email: string,
    attributes?: unknown,
  ): Promise<boolean> {
    const { digitalTwin } = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = StartDigitalTwinEmailVerificationRequest.fromJSON({
      digitalTwin,
      email,
    });
    if (attributes) {
      request.attributes = Property.objectToValue(attributes) as MapValue;
    }

    return new Promise<boolean>((resolve, reject) => {
      this.client.startDigitalTwinEmailVerification(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  verifyDigitalTwinEmail(token: string): Promise<sdkTypes.DigitalTwin> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }

    const request = VerifyDigitalTwinEmailRequest.fromJSON({
      token,
    });

    return new Promise<sdkTypes.DigitalTwin>((resolve, reject) => {
      this.client.verifyDigitalTwinEmail(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            const dt = response.digitalTwin;
            resolve(
              new sdkTypes.DigitalTwin(
                Utils.uuidToString(dt.id),
                Utils.uuidToString(dt.tenantId),
                dt.kind,
                dt.state,
              ),
            );
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing verify email response'));
          }
        }
      });
    });
  }

  startForgottenPasswordFlow(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
  ): Promise<boolean> {
    const digitalTwin = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = StartForgottenPasswordFlowRequest.fromJSON(digitalTwin);

    return new Promise<boolean>((resolve, reject) => {
      this.client.startForgottenPasswordFlow(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  changePasswordByToken(token: string, password: string): Promise<boolean> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = ChangePasswordRequest.fromJSON({
      token,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err, response) => {
        if (err) reject(err);
        else if (response.error) reject(response.error);
        else resolve(true);
      });
    });
  }

  /**
   * @deprecated sine 0.1.6, use changePasswordByToken instead
   */
  changeMyPassword(token: string, password: string): Promise<boolean> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = ChangePasswordRequest.fromJSON({
      token,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  changePassword(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
    password: string,
  ): Promise<boolean> {
    const { digitalTwin } = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = ChangePasswordRequest.fromJSON({
      digitalTwin,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err, response) => {
        if (err) reject(err);
        else if (response.error) reject(response.error);
        else resolve(true);
      });
    });
  }

  /**
   * @deprecated sience 0.1.6, use changePassword instead
   */
  changePasswordOfDigitalTwin(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
    password: string,
  ): Promise<boolean> {
    const { digitalTwin } = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = ChangePasswordRequest.fromJSON({
      digitalTwin,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  deleteDigitalTwin(
    digitalTwinId: string | Buffer,
    tenantId: string | Buffer,
  ): Promise<sdkTypes.DigitalTwin> {
    const digitalTwin = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = DeleteDigitalTwinRequest.fromJSON({
      id: digitalTwin,
    });

    return new Promise<sdkTypes.DigitalTwin>((resolve, reject) => {
      this.client.deleteDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            const dt = response.digitalTwin;
            resolve(
              new sdkTypes.DigitalTwin(
                Utils.uuidToString(dt.id),
                Utils.uuidToString(dt.tenantId),
                dt.kind,
                dt.state,
              ),
            );
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'));
          }
        }
      });
    });
  }

  deleteDigitalTwinByToken(token: string): Promise<sdkTypes.DigitalTwin> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = DeleteDigitalTwinRequest.fromJSON({
      id: Utils.createDigitalTwinIdFromToken(token),
    });

    return new Promise<sdkTypes.DigitalTwin>((resolve, reject) => {
      this.client.deleteDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            const dt = response.digitalTwin;
            resolve(
              new sdkTypes.DigitalTwin(
                Utils.uuidToString(dt.id),
                Utils.uuidToString(dt.tenantId),
                dt.kind,
                dt.state,
              ),
            );
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'));
          }
        }
      });
    });
  }

  checkConsentChallenge(challenge: string): Promise<ConsentChallenge> {
    const request = CheckConsentChallengeRequest.fromJSON({
      challenge,
    });

    return new Promise((resolve, reject) => {
      this.client.checkConsentChallenge(request, (err, response) => {
        if (err) reject(err);
        else resolve(ConsentChallenge.deserialize(response, challenge));
      });
    });
  }

  createConsentVerifier(consentChallenge: ConsentChallenge): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }>;

  createConsentVerifier(
    consentChallenge: string,
    scopes: string[],
    denialReason?: ConsentChallengeDenial | null,
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }>;

  createConsentVerifier(
    consentChallenge: string | ConsentChallenge,
    scopes: string[] = [],
    denialReason?: ConsentChallengeDenial | null,
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }> {
    if (typeof consentChallenge !== 'string') {
      return this.createConsentVerifier(
        consentChallenge.challenge,
        consentChallenge.getApprovedScopeNames(),
        consentChallenge.getDenialReason(),
      );
    }

    let request: CreateConsentVerifierRequest;
    if (denialReason) {
      request = CreateConsentVerifierRequest.fromJSON({
        challenge: consentChallenge,
        denial: denialReason,
      });
    } else {
      request = CreateConsentVerifierRequest.fromJSON({
        challenge: consentChallenge,
        approval: { grantScopes: scopes },
      });
    }

    return new Promise((resolve, reject) => {
      this.client.createConsentVerifier(request, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }
}
