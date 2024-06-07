// import { ConfigNode } from '../../../grpc/indykite/config/v1beta1/model';

import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import {
  CreateConfigNodeResponse,
  ReadConfigNodeResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { SdkError, SdkErrorCode, SkdErrorText } from '../../error';
import { Utils } from '../../utils/utils';
import { AuthorizationPolicy } from './authorization_policy';
import { ConsentNode } from './consent_configuration';

/**
 * Docs: https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ConfigNode
 */
export class ConfigNode {
  // Globally unique identifier.
  public id?: string;
  // Name is unique name of configuration object.
  // name?: string;
  // Human readable name of configuration.
  public displayName?: string;
  // Description of the configuration.
  public description?: StringValue;
  // Output only. The time at which the configuration was created.
  public createTime?: Date;
  // Output only. The time at which the configuration was last changed.
  // This value is initially set to the `create_time` then increases monotonically with each change.
  public updateTime?: Date;
  // Output only. The user/service id who created the configuration.
  public createdBy?: string;
  // Output only. The user/service id who last changed the configuration.
  public updatedBy?: string;
  // Output only. The time this configuration was destroyed.
  // Only present if deletion of object was requested.
  public destroyTime?: Date;
  // Output only. The time this configuration will be entirely deleted.
  // Only present if deletion of object was requested.
  public deleteTime?: Date;
  // Output only. Multiversion concurrency control version.
  public etag?: string;
  // CustomerId this object is directly or indirectly connected to.
  public customerId?: string;
  // AppSpaceId this object is directly or indirectly connected to.
  public appSpaceId?: string;

  constructor(public name: string) {}

  static deserialize(
    response: CreateConfigNodeResponse & ReadConfigNodeResponse,
    name?: string,
    displayName?: string,
    description?: string,
    customerId?: string,
    appSpaceId?: string,
  ): ConfigNode {
    if (response.configNode) {
      const tmpConfigNode = new ConfigNode(response.configNode.name);
      tmpConfigNode.id = response.configNode.id;
      tmpConfigNode.displayName = response.configNode.displayName;
      tmpConfigNode.description = StringValue.create(response.configNode.description);
      tmpConfigNode.createTime = Utils.timestampToDate(response.configNode.createTime);
      tmpConfigNode.updateTime = Utils.timestampToDate(response.configNode.updateTime);
      tmpConfigNode.createdBy = response.configNode.createdBy;
      tmpConfigNode.updatedBy = response.configNode.updatedBy;
      tmpConfigNode.destroyTime = Utils.timestampToDate(response.configNode.destroyTime);
      tmpConfigNode.deleteTime = Utils.timestampToDate(response.configNode.deleteTime);
      tmpConfigNode.etag = response.configNode.etag;
      tmpConfigNode.customerId = response.configNode.customerId;
      tmpConfigNode.appSpaceId = response.configNode.appSpaceId;
      return tmpConfigNode;
    }

    if (!name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, SkdErrorText.SDK_CODE_1(ConfigNode.name));
    }
    const tmpConfigNode = new ConfigNode(name);
    tmpConfigNode.displayName = displayName;
    tmpConfigNode.description = description ? StringValue.fromJson(description) : undefined;
    tmpConfigNode.customerId = customerId;
    tmpConfigNode.appSpaceId = appSpaceId;
    return tmpConfigNode;
  }
}

export type ConfigNodeType = ConfigNode | AuthorizationPolicy | ConsentNode;
