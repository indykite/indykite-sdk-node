import { SdkErrorCode, SdkError } from '../../error';
import {
  ReadApplicationAgentCredentialResponse,
  RegisterApplicationAgentCredentialResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

export class ApplicationAgentCredential {
  constructor(
    public id: string,
    public kid: string,
    public applicationAgentId: string,
    public displayName?: string,
    public customerId?: string,
    public appSpaceId?: string,
    public applicationId?: string,
    public expireTime?: Date,
    public createTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
    public agentConfig?: string,
  ) {}

  static deserialize(
    response: RegisterApplicationAgentCredentialResponse,
    displayName: string,
    applicationAgentId: string,
  ): ApplicationAgentCredential;
  static deserialize(response: ReadApplicationAgentCredentialResponse): ApplicationAgentCredential;
  static deserialize(
    response: RegisterApplicationAgentCredentialResponse & ReadApplicationAgentCredentialResponse,
    displayName?: string,
    applicationAgentId?: string,
  ): ApplicationAgentCredential {
    if (response.applicationAgentCredential) {
      return new ApplicationAgentCredential(
        response.applicationAgentCredential.id,
        response.applicationAgentCredential.kid,
        response.applicationAgentCredential.applicationAgentId,
        response.applicationAgentCredential.displayName,
        response.applicationAgentCredential.customerId,
        response.applicationAgentCredential.appSpaceId,
        response.applicationAgentCredential.applicationId,
        undefined,
        Utils.timestampToDate(response.applicationAgentCredential.createTime),
        Utils.timestampToDate(response.applicationAgentCredential.deleteTime),
        Utils.timestampToDate(response.applicationAgentCredential.destroyTime),
      );
    }

    if (!displayName || !applicationAgentId) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize application agent credential");
    }

    return new ApplicationAgentCredential(
      response.id,
      response.kid,
      applicationAgentId,
      displayName,
      undefined,
      undefined,
      undefined,
      Utils.timestampToDate(response.expireTime),
      Utils.timestampToDate(response.createTime),
      undefined,
      undefined,
      Buffer.from(response.agentConfig).toString('utf-8'),
    );
  }
}
