import { SdkErrorCode, SdkError } from '../../error';
import {
  CreateApplicationSpaceResponse,
  ReadApplicationSpaceResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

export class ApplicationSpace {
  constructor(
    public id: string,
    public name: string,
    public customerId: string,
    public etag?: string,
    public displayName?: string,
    public issuerId?: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
  ) {}

  static deserialize(
    response: CreateApplicationSpaceResponse,
    customerId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): ApplicationSpace;
  static deserialize(response: ReadApplicationSpaceResponse): ApplicationSpace;
  static deserialize(
    response: CreateApplicationSpaceResponse & ReadApplicationSpaceResponse,
    customerId?: string,
    name?: string,
    displayName?: string,
    description?: string,
  ): ApplicationSpace {
    if (response.appSpace) {
      return new ApplicationSpace(
        response.appSpace.id,
        response.appSpace.name,
        response.appSpace.customerId,
        response.appSpace.etag,
        response.appSpace.displayName,
        response.appSpace.issuerId,
        response.appSpace.description ? response.appSpace.description.value : undefined,
        Utils.timestampToDate(response.appSpace.createTime),
        Utils.timestampToDate(response.appSpace.updateTime),
        Utils.timestampToDate(response.appSpace.deleteTime),
        Utils.timestampToDate(response.appSpace.destroyTime),
      );
    }

    if (!customerId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize application space");
    }

    return new ApplicationSpace(
      response.id,
      name,
      customerId,
      response.etag,
      displayName,
      undefined,
      description,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
    );
  }
}
