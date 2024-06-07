import {
  DataAccessRequest,
  GrantConsentRequest,
  GrantConsentResponse,
  ListConsentsRequest,
  RevokeConsentRequest,
  RevokeConsentResponse,
} from '../grpc/indykite/tda/v1beta1/trusted_data_access_api';

import { SdkError, SdkErrorCode } from './error';
import { SdkClient } from './client/client';
import { TrustedDataAccessAPIClient } from '../grpc/indykite/tda/v1beta1/trusted_data_access_api.grpc-client';
import { Node, User } from '../grpc/indykite/knowledge/objects/v1beta1/ikg';
import { Consent } from '../grpc/indykite/tda/v1beta1/model';

/**
 * @category Clients
 * @example
 * // Example how to create a new tda client
 * const sdk = await TrustedDataAccessClient.createInstance();
 */
export class TrustedDataAccessClient {
  private client: TrustedDataAccessAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as TrustedDataAccessAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<TrustedDataAccessClient> {
    return new Promise<TrustedDataAccessClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(TrustedDataAccessAPIClient, appCredential)
        .then((sdk) => {
          resolve(new TrustedDataAccessClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * @since 0.7.4
   * @example
   * async function example(sdk: TrustedDataAccessClient) {
   *   const result = await sdk.grantConsent({
   *     user: User({"userId":"gid:userid"}),
   *     consentId: 'gid:consent-id',
   *     validityPeriod: 86400,
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  grantConsent(
    user: User,
    consentId: string,
    validityPeriod: string,
  ): Promise<GrantConsentResponse> {
    const request = GrantConsentRequest.create({
      user,
      consentId,
      validityPeriod,
    });

    return new Promise((resolve, reject) => {
      this.client.grantConsent(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing grant consent response'));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.4
   * @example
   * async function example(sdk: TrustedDataAccessClient) {
   *   const result = await sdk.revokeConsent({
   *     user: User({"userId":"gid:userid"}),
   *     consentId: 'gid:consent-id',
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  revokeConsent(user: User, consentId: string): Promise<RevokeConsentResponse> {
    const request = RevokeConsentRequest.create({
      user,
      consentId,
    });

    return new Promise((resolve, reject) => {
      this.client.revokeConsent(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing revoke consent response'));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.4
   * @example
   * async function example(sdk: TrustedDataAccessClient) {
   *   const result = sdk.listConsents({
   *     user: User({"userId":"gid:userid"}),
   *     applicationId: 'gid:application-id',
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  listConsents(user: User, applicationId?: string): Promise<Consent[]> {
    const request: ListConsentsRequest = {
      user,
      applicationId,
    } as ListConsentsRequest;
    return new Promise((resolve, reject) => {
      this.client.listConsents(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing list consents response'));
        } else {
          resolve(response.consents);
        }
      });
    });
  }

  /**
   * @since 0.7.4
   * @example
   * async function example(sdk: TrustedDataAccessClient) {
   *   const result = sdk.dataAccess({
   *     consentId: 'gid:consent-id',
   *     user: User({"userId":"gid:userid"}),
   *     applicationId: 'gid:application-id',
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  dataAccess(consentId: string, applicationId?: string, user?: User): Promise<Node[]> {
    const request: DataAccessRequest = {
      consentId,
      applicationId,
      user,
    } as DataAccessRequest;
    return new Promise((resolve, reject) => {
      this.client.dataAccess(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing data access response'));
        } else {
          resolve(response.nodes);
        }
      });
    });
  }
}
