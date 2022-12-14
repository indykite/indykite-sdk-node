import { SdkErrorCode, SdkError } from '../../error';
import {
  ReadServiceAccountCredentialResponse,
  RegisterServiceAccountCredentialResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

export class ServiceAccountCredential {
  constructor(
    public id: string,
    public kid: string,
    public serviceAccountId: string,
    public displayName?: string,
    public customerId?: string,
    public appSpaceId?: string,
    public expireTime?: Date,
    public createTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
    public serviceAccountConfig?: string,
  ) {}

  static deserialize(
    response: RegisterServiceAccountCredentialResponse,
    displayName: string,
    serviceAccountId: string,
  ): ServiceAccountCredential;
  static deserialize(response: ReadServiceAccountCredentialResponse): ServiceAccountCredential;
  static deserialize(
    response: RegisterServiceAccountCredentialResponse & ReadServiceAccountCredentialResponse,
    displayName?: string,
    serviceAccountId?: string,
  ): ServiceAccountCredential {
    if (response.serviceAccountCredential) {
      return new ServiceAccountCredential(
        response.serviceAccountCredential.id,
        response.serviceAccountCredential.kid,
        response.serviceAccountCredential.serviceAccountId,
        response.serviceAccountCredential.displayName,
        response.serviceAccountCredential.customerId,
        response.serviceAccountCredential.appSpaceId,
        undefined,
        Utils.timestampToDate(response.serviceAccountCredential.createTime),
        Utils.timestampToDate(response.serviceAccountCredential.deleteTime),
        Utils.timestampToDate(response.serviceAccountCredential.destroyTime),
      );
    }

    if (!displayName || !serviceAccountId) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize service account credential");
    }

    return new ServiceAccountCredential(
      response.id,
      response.kid,
      serviceAccountId,
      displayName,
      undefined,
      undefined,
      Utils.timestampToDate(response.expireTime),
      Utils.timestampToDate(response.createTime),
      undefined,
      undefined,
      Buffer.from(response.serviceAccountConfig).toString('utf-8'),
    );
  }
}
