import { SdkErrorCode, SdkError } from '../../error';
import {
  CreateApplicationAgentResponse,
  ReadApplicationAgentResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

export class ApplicationAgent {
  constructor(
    public id: string,
    public name: string,
    public applicationId: string,
    public appSpaceId?: string,
    public displayName?: string,
    public customerId?: string,
    public etag?: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
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
        response.applicationAgent.description?.value,
        Utils.timestampToDate(response.applicationAgent.createTime),
        Utils.timestampToDate(response.applicationAgent.updateTime),
        Utils.timestampToDate(response.applicationAgent.deleteTime),
        Utils.timestampToDate(response.applicationAgent.destroyTime),
      );
    }

    if (!applicationId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize application agent");
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
    );
  }
}
