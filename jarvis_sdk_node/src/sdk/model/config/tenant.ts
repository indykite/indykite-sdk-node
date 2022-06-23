import { SdkErrorCode, SdkError } from '../../error';
import {
  CreateTenantResponse,
  ReadTenantResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

export class Tenant {
  constructor(
    public id: string,
    public name: string,
    public customerId?: string,
    public appSpaceId?: string,
    public displayName?: string,
    public issuerId?: string,
    public etag?: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
  ) {}

  static deserialize(
    response: CreateTenantResponse,
    issuerId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): Tenant;
  static deserialize(response: ReadTenantResponse): Tenant;
  static deserialize(
    response: ReadTenantResponse & CreateTenantResponse,
    issuerId?: string,
    name?: string,
    displayName?: string,
    description?: string,
  ): Tenant {
    if (response.tenant) {
      return new Tenant(
        response.tenant.id,
        response.tenant.name,
        response.tenant.customerId,
        response.tenant.appSpaceId,
        response.tenant.displayName,
        response.tenant.issuerId,
        response.tenant.etag,
        response.tenant.description?.value,
        Utils.timestampToDate(response.tenant.createTime),
        Utils.timestampToDate(response.tenant.updateTime),
        Utils.timestampToDate(response.tenant.deleteTime),
        Utils.timestampToDate(response.tenant.destroyTime),
      );
    }

    if (!issuerId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize tenant");
    }

    return new Tenant(
      response.id,
      name,
      undefined,
      undefined,
      displayName,
      issuerId,
      response.etag,
      description,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
    );
  }
}
