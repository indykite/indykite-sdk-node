// import { ApplicationAgentCredential } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import {
  ReadApplicationAgentCredentialResponse,
  RegisterApplicationAgentCredentialResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ApplicationAgentCredential
 */
export class ApplicationAgentCredential {
  constructor(
    // #1 Globally unique identifier.
    public id: string,
    // #2 Kid is public key ID
    public kid: string,
    // #9 ApplicationAgentId this object is directly connected to.
    public applicationAgentId: string,
    // #3 Human readable name of configuration.
    public displayName?: string,
    // #10 CustomerId this object is directly or indirectly connected to.
    public customerId?: string,
    // #11 AppSpaceId this object is directly or indirectly connected to.
    public appSpaceId?: string,
    // #12 ApplicationId this object is directly connected to.
    public applicationId?: string,
    public expireTime?: Date,
    // #5 Output only. The time at which the configuration was created.
    public createTime?: Date,
    // #8 Output only. The time this configuration will be entirely deleted.
    // Only present if deletion of object was requested.
    public deleteTime?: Date,
    // #7 Output only. The time this configuration was destroyed.
    // Only present if deletion of object was requested.
    public destroyTime?: Date,
    public agentConfig?: string,
    // #6 Output only. The user/service id who created the configuration.
    public createdBy?: string,
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
        undefined, // expireTime
        Utils.timestampToDate(response.applicationAgentCredential.createTime),
        Utils.timestampToDate(response.applicationAgentCredential.deleteTime),
        Utils.timestampToDate(response.applicationAgentCredential.destroyTime),
        undefined, // agentConfig
        response.applicationAgentCredential.createdBy,
      );
    }

    if (!displayName || !applicationAgentId) {
      throw new SdkError(
        SdkErrorCode.SDK_CODE_1,
        SkdErrorText.SDK_CODE_1(ApplicationAgentCredential.name),
      );
    }

    return new ApplicationAgentCredential(
      response.id,
      response.kid,
      applicationAgentId,
      displayName,
      undefined, // customerId
      undefined, // appSpaceId
      undefined, // applicationId
      Utils.timestampToDate(response.expireTime),
      Utils.timestampToDate(response.createTime),
      undefined, // deleteTime
      undefined, // destroyTime
      Buffer.from(response.agentConfig).toString('utf-8'),
      undefined, // createdBy
    );
  }
}
