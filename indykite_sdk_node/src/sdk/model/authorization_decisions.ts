import * as grpcId from '../../grpc/indykite/identity/v1beta2/identity_management_api';
import { Utils } from '../utils/utils';

/**
 * @since 0.1.16
 */
export interface Decisions {
  [actionName: string]: boolean;
}

/**
 * @since 0.1.16
 */
export interface Resources {
  [resource: string]: Decisions;
}

/**
 * This class contains information about what actions within what resources is a subject allowed to do.
 * @since 0.1.16
 */
export class AuthorizationDecisions {
  /**
   * @since 0.1.16
   * @param resources The list of resources. Each resource contains a list of actions
   * with a flag whether the action is allowed (true means allowed action).
   * @param decisionTime The time when the decision was made.
   */
  constructor(public resources: Resources, public decisionTime?: Date) {}

  /**
   * Deserialize the object returned from the server.
   * @since 0.1.16
   * @example
   * const decisions = AuthorizationDecisions.deserialize({
   *   "decisions": {
   *     "lotA": {
   *       "allowAction": {
   *         "HAS_FREE_PARKING": true
   *       }
   *     },
   *     "lotB": {
   *       "allowAction": {
   *         "HAS_FREE_PARKING": false
   *       }
   *     }
   *   },
   *   "decisionTime": {
   *     "seconds": "1673360721",
   *     "nanos": 952172824
   *   }
   * });
   */
  static deserialize(response: grpcId.IsAuthorizedResponse): AuthorizationDecisions {
    const resources = Object.keys(response.decisions).reduce(
      (resources: Resources, resourceKey: string) => {
        const actions = Object.keys(response.decisions[resourceKey].allowAction).reduce(
          (decisions: Decisions, actionKey: string) => {
            decisions[actionKey] = response.decisions[resourceKey].allowAction[actionKey];
            return decisions;
          },
          {} as Decisions,
        );

        resources[resourceKey] = actions;
        return resources;
      },
      {} as Resources,
    );

    return new AuthorizationDecisions(resources, Utils.timestampToDate(response.decisionTime));
  }

  /**
   * Check whether the action is allowed in the given resource.
   * @since 0.1.16
   * @param resource The name of the resource.
   * @param action The name of the action.
   * @returns True if the action is allowed.
   * @example
   * function hasLotAFreeParking(decisions: AuthorizationDecisions) {
   *   return decisions.isAuthorized('lotA', 'HAS_FREE_PARKING');
   * }
   */
  isAuthorized(resource: string, action: string): boolean {
    const actions = this.resources[resource] ?? {};
    return !!actions[action];
  }
}
