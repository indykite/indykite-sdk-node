import * as grpcId from '../../grpc/indykite/identity/v1beta1/identity_management_api';
import { Utils } from '../utils/utils';

export interface Decisions {
  [actionName: string]: boolean;
}

export interface Resources {
  [resource: string]: Decisions;
}

export class AuthorizationDecisions {
  constructor(public resources: Resources, public decisionTime?: Date) {}

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

  isAuthorized(resource: string, action: string): boolean {
    const actions = this.resources[resource] ?? {};
    return !!actions[action];
  }
}
