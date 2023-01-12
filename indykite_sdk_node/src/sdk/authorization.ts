import { SdkClient } from './client/client';
import { AuthorizationDecisions } from './model/authorization_decisions';
import { IsAuthorizedRequest } from '../grpc/indykite/authorization/v1beta1/authorization_service';
import { AuthorizationAPIClient } from '../grpc/indykite/authorization/v1beta1/authorization_service.grpc-client';
import { DigitalTwinIdentifier } from './model';
import { AuthorizationResource } from './model/authorization_resource';

/**
 * @category Clients
 * @since 0.2.2
 * @example
 * // Example how to create a new authorization client
 * const sdk = await AuthorizationClient.createInstance();
 */
export class AuthorizationClient {
  private client: AuthorizationAPIClient;

  /**
   * @since 0.2.2
   */
  constructor(sdk: SdkClient) {
    this.client = sdk.client as AuthorizationAPIClient;
  }

  /**
   * @since 0.2.2
   */
  static createInstance(appCredential?: string | unknown): Promise<AuthorizationClient> {
    return new Promise<AuthorizationClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(AuthorizationAPIClient, appCredential)
        .then((sdk) => {
          resolve(new AuthorizationClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Check whether the actions are allowed in the specified resources for the selected subject
   * @since 0.2.2
   * @param subject The subject which will be checked whether has an access to the actions
   * @param resources The resources which will be checked
   * @param actions The actions which will be checked
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await sdk.isAuthorized(
   *         DigitalTwinIdentifier.fromToken(token),
   *         [
   *           new AuthorizationResource('lotA', 'ParkingLot'),
   *           new AuthorizationResource('lotB', 'ParkingLot'),
   *         ],
   *         ['HAS_FREE_PARKING'],
   *       );
   *       console.log('LotA:', resp.isAuthorized('lotA', 'HAS_FREE_PARKING'));
   *       console.log('LotB:', resp.isAuthorized('lotB', 'HAS_FREE_PARKING'));
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  isAuthorized(
    subject: DigitalTwinIdentifier,
    resources: AuthorizationResource[],
    actions: string[],
  ): Promise<AuthorizationDecisions> {
    return new Promise((resolve, reject) => {
      const request = IsAuthorizedRequest.create({
        actions,
        resources,
        subject: {
          oneofKind: 'digitalTwinIdentifier',
          digitalTwinIdentifier: subject.marshal(),
        },
      });

      this.client.isAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) resolve(new AuthorizationDecisions({}));
        else resolve(AuthorizationDecisions.deserialize(res));
      });
    });
  }
}
