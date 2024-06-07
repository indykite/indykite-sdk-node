// import { ApplicationAgent } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import {
  CreateApplicationAgentResponse,
  ReadApplicationAgentResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ApplicationAgent
 */
export class ApplicationAgent {
  constructor(
    // #1 Globally unique identifier.
    public id: string,
    // #2 Name is unique name of configuration object.
    public name: string,
    // #12 ApplicationId this object is directly connected to.
    public applicationId: string,
    // #12 AppSpaceId this object is directly or indirectly connected to.
    public appSpaceId?: string,
    // #3 Human readable name of configuration.
    public displayName?: string,
    // #10 CustomerId this object is directly or indirectly connected to.
    public customerId?: string,
    // #9 Output only. Multiversion concurrency control version.
    public etag?: string,
    // #4 Description of the configuration.
    public description?: string,
    // #5 Output only. The time at which the configuration was created.
    public createTime?: Date,
    // #6 Output only. The time at which the configuration was last changed.
    // This value is initially set to the `create_time` then increases monotonically with each change.
    public updateTime?: Date,
    // #8 Output only. The time this configuration will be entirely deleted.
    // Only present if deletion of object was requested.
    public deleteTime?: Date,
    // #7 Output only. The time this configuration was destroyed.
    // Only present if deletion of object was requested.
    public destroyTime?: Date,
    // #13 Output only. The user/service id who created the configuration.
    public createdBy?: string,
    // #14 Output only. The user/service id who last changed the configuration.
    public updatedBy?: string,
    // #15 Restriction list of consent if apply
    public apiAccessRestriction?: string[],
  ) {}

  static deserialize(
    response: CreateApplicationAgentResponse,
    applicationId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): ApplicationAgent;
  static deserialize(response: ReadApplicationAgentResponse): ApplicationAgent;
  static deserialize(
    response: CreateApplicationAgentResponse & ReadApplicationAgentResponse,
    applicationId?: string,
    name?: string,
    displayName?: string,
    description?: string,
  ): ApplicationAgent {
    if (response.applicationAgent) {
      return new ApplicationAgent(
        response.applicationAgent.id,
        response.applicationAgent.name,
        response.applicationAgent.applicationId,
        response.applicationAgent.appSpaceId,
        response.applicationAgent.displayName,
        response.applicationAgent.customerId,
        response.applicationAgent.etag,
        response.applicationAgent.description?.value ?? undefined,
        Utils.timestampToDate(response.applicationAgent.createTime),
        Utils.timestampToDate(response.applicationAgent.updateTime),
        Utils.timestampToDate(response.applicationAgent.deleteTime),
        Utils.timestampToDate(response.applicationAgent.destroyTime),
        response.applicationAgent.createdBy,
        response.applicationAgent.updatedBy,
        response.applicationAgent.apiAccessRestriction,
      );
    }

    if (!applicationId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, SkdErrorText.SDK_CODE_1(ApplicationAgent.name));
    }

    return new ApplicationAgent(
      response.id,
      name,
      applicationId,
      undefined,
      displayName,
      undefined,
      response.etag,
      description,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
      undefined, // deleteTime
      undefined, // destroyTime
      response.createdBy,
      response.updatedBy,
    );
  }
}
