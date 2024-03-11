import {
  CheckInvitationStateRequest,
  CheckInvitationStateResponse,
  CheckOAuth2ConsentChallengeRequest,
  CheckOAuth2ConsentChallengeResponse,
  CreateConsentRequest,
  CreateConsentResponse,
  CreateInvitationRequest,
  CreateOAuth2ConsentVerifierRequest,
  CreateOAuth2ConsentVerifierResponse,
  EnrichTokenRequest,
  ListConsentsRequest,
  ResendInvitationRequest,
  RevokeConsentRequest,
  TokenIntrospectRequest,
} from '../grpc/indykite/identity/v1beta2/identity_management_api';
import * as sdkTypes from './model';

import { SdkErrorCode, SdkError } from './error';
import { SdkClient } from './client/client';
import { IdentityManagementAPIClient } from '../grpc/indykite/identity/v1beta2/identity_management_api.grpc-client';
import { Utils } from './utils/utils';

/**
 * @category Clients
 * @example
 * // Example how to create a new identity client
 * const sdk = await IdentityClient.createInstance();
 */
export class IdentityClient {
  private client: IdentityManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as IdentityManagementAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<IdentityClient> {
    return new Promise<IdentityClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(IdentityManagementAPIClient, appCredential)
        .then((sdk) => {
          resolve(new IdentityClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Validate the token and return information about it.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const tokenInfo = await sdk.introspectToken(USER_ACCESS_TOKEN);
   *   if (!tokenInfo.active) {
   *     console.error('Invalid token');
   *     return;
   *   }
   *   const dtId = tokenInfo.tokenInfo?.subject?.id;
   *   const tenantId = tokenInfo.tokenInfo?.subject?.tenantId;
   *   if (!dtId || !tenantId) {
   *     console.error('Unknown subject');
   *     return;
   *   }
   *   const dt = await sdk.getDigitalTwin(new DigitalTwinBuilder(dtId, tenantId));
   * }
   */
  introspectToken(token: string): Promise<sdkTypes.TokenInfo> {
    // Build request message
    const request = TokenIntrospectRequest.fromJson({ token });

    // Invoke the RPC
    return new Promise<sdkTypes.TokenInfo>((resolve, reject) => {
      this.client.tokenIntrospect(request, (err, response) => {
        if (err) reject(err);
        try {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing token introspect response'));
            return;
          }
          resolve(response);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * This function sends invitation token to invitee.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.createEmailInvitation(
   *     'user@example.com',
   *     'gid:tenant-id',
   *     'custom-unique-reference-id',
   *   );
   * }
   */
  createEmailInvitation(
    invitee: string,
    tenantId: string,
    referenceId: string,
    expireTime?: Date,
    inviteAtTime?: Date,
    messageAttributes?: Record<string, unknown>,
  ): Promise<void> {
    const request: CreateInvitationRequest = {
      invitee: {
        oneofKind: 'email',
        email: invitee,
      },
      tenantId,
      referenceId,
    };

    if (inviteAtTime) request.inviteAtTime = Utils.dateToTimestamp(inviteAtTime);
    if (expireTime) request.expireTime = Utils.dateToTimestamp(expireTime);

    return new Promise<void>((resolve, reject) => {
      if (messageAttributes) {
        const attributesValue = Utils.objectToValue(messageAttributes);
        if (attributesValue.value.oneofKind !== 'mapValue') {
          reject(
            new SdkError(
              SdkErrorCode.SDK_CODE_1,
              'Message attributes property needs to be an object value',
            ),
          );
          return;
        }
        request.messageAttributes = attributesValue.value.mapValue;
      }

      this.client.createInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  createMobileInvitation(
    invitee: string,
    tenantId: string,
    referenceId: string,
    expireTime?: Date,
    inviteAtTime?: Date,
    messageAttributes?: Record<string, unknown>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = CreateInvitationRequest.fromJson({
        tenantId,
        referenceId,
        mobile: invitee,
      });

      if (expireTime) {
        request.expireTime = Utils.dateToTimestamp(expireTime);
      }

      if (inviteAtTime) {
        request.inviteAtTime = Utils.dateToTimestamp(inviteAtTime);
      }

      if (messageAttributes) {
        const attributesValue = Utils.objectToValue(messageAttributes);
        if (attributesValue.value.oneofKind !== 'mapValue') {
          reject(
            new SdkError(
              SdkErrorCode.SDK_CODE_1,
              'Message attributes property needs to be an object value',
            ),
          );
          return;
        }
        request.messageAttributes = attributesValue.value.mapValue;
      }

      this.client.createInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * This function checks the status of invitation.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.createEmailInvitation(
   *     'user@example.com',
   *     'gid:tenant-id',
   *     'custom-unique-reference-id',
   *   );
   *   const state = await sdk.checkInvitationState('custom-unique-reference-id');
   *   console.log(JSON.stringify(state, null, 2));
   * }
   */
  checkInvitationState(referenceId: string): Promise<CheckInvitationStateResponse> {
    return new Promise((resolve, reject) => {
      const request: CheckInvitationStateRequest = {
        identifier: {
          oneofKind: 'referenceId',
          referenceId,
        },
      };

      this.client.checkInvitationState(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing check invitation response'));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * This function checks the status of invitation.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const state = await sdk.checkInvitationState('token-sent-to-email');
   *   console.log(JSON.stringify(state, null, 2));
   * }
   */
  checkInvitationToken(invitationToken: string): Promise<CheckInvitationStateResponse> {
    return new Promise((resolve, reject) => {
      const request: CheckInvitationStateRequest = {
        identifier: {
          oneofKind: 'invitationToken',
          invitationToken,
        },
      };

      this.client.checkInvitationState(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing check invitation response'));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * This function sends invitation token to invitee.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.resendInvitation('custom-unique-reference-id');
   * }
   */
  resendInvitation(referenceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: ResendInvitationRequest = {
        referenceId,
      };

      this.client.resendInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * This function revokes a pending invitation identified by referenceID.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.cancelInvitation('custom-unique-reference-id');
   * }
   */
  cancelInvitation(referenceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: ResendInvitationRequest = {
        referenceId,
      };

      this.client.cancelInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.enrichToken({
   *     accessToken: userToken,
   *     tokenClaims: {
   *       fields: {
   *         myTokenValue: {
   *           kind: {
   *             oneofKind: 'stringValue',
   *             stringValue: 'abc',
   *           },
   *         },
   *       },
   *     },
   *     sessionClaims: {
   *       fields: {
   *         mySessionValue: {
   *           kind: {
   *             oneofKind: 'numberValue',
   *             numberValue: 44,
   *           },
   *         },
   *       },
   *     },
   *   });
   * }
   */
  enrichToken(req: EnrichTokenRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: EnrichTokenRequest = {
        accessToken: req.accessToken,
      };
      if (req.tokenClaims) {
        request.tokenClaims = req.tokenClaims;
      }
      if (req.sessionClaims) {
        request.sessionClaims = req.sessionClaims;
      }

      this.client.enrichToken(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const consentChallengeInfo = await sdk.checkConsentChallenge({
   *     challenge: 'consent-challenge-token',
   *   });
   *   console.log(JSON.stringify(consentChallengeInfo, null, 2));
   * }
   */
  checkConsentChallenge(
    request: CheckOAuth2ConsentChallengeRequest,
  ): Promise<CheckOAuth2ConsentChallengeResponse | undefined> {
    return new Promise((resolve, reject) => {
      this.client.checkOAuth2ConsentChallenge(request, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const consentVerifier = await sdk.createConsentVerifier({
   *     consentChallenge: 'consent-challenge-token',
   *     result: {
   *       oneofKind: 'approval',
   *       approval: {
   *         grantedAudiences: [],
   *         grantScopes: ['openid', 'email'],
   *         remember: true,
   *         rememberFor: '0',
   *       },
   *     },
   *   });
   *   console.log(JSON.stringify(consentVerifier, null, 2));
   * }
   */
  createConsentVerifier(
    request: CreateOAuth2ConsentVerifierRequest,
  ): Promise<CreateOAuth2ConsentVerifierResponse | undefined> {
    return new Promise((resolve, reject) => {
      this.client.createOAuth2ConsentVerifier(request, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const result = await sdk.createConsent({
   *     piiPrincipalId: 'gid:principal-id',
   *     piiProcessorId: 'gid:processor-id',
   *     properties: ['parking-lot'],
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  createConsent(
    piiProcessorId: string,
    piiPrincipalId: string,
    properties: string[],
  ): Promise<CreateConsentResponse> {
    const request = CreateConsentRequest.create({
      piiProcessorId,
      piiPrincipalId,
      properties,
    });

    return new Promise((resolve, reject) => {
      this.client.createConsent(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing create consent response'));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const result = await sdk.revokeConsent({
   *     piiPrincipalId: 'gid:principal-id',
   *     consentIds: ['consent-id1', 'consent-id2'],
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  revokeConsent(piiPrincipalId: string, consentIds: string[]): Promise<void> {
    const request = RevokeConsentRequest.create({
      piiPrincipalId,
      consentIds,
    });

    return new Promise((resolve, reject) => {
      this.client.revokeConsent(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing revoke consent response'));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const stream = sdk.listConsents({
   *     piiPrincipalId: 'gid:principal-id',
   *   });
   *   stream.on('data', (record: grpcIdentityAPI.ListConsentsResponse) => {
   *     console.log(JSON.stringify(record.consentReceipt, null, 2));
   *   });
   * }
   */
  listConsents(piiPrincipalId: string): Promise<{ consents: sdkTypes.Consent[] }> {
    const request = ListConsentsRequest.create({
      piiPrincipalId,
    });

    return new Promise((resolve, reject) => {
      const consentList: sdkTypes.Consent[] = [];
      const stream = this.client
        .listConsents(request)
        .on('readable', () => {
          const value = stream.read();
          if (value && value.consentReceipt) {
            consentList.push(sdkTypes.Consent.deserialize(value));
          }
        })
        .on('close', () => {
          resolve({ consents: consentList });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }
}
