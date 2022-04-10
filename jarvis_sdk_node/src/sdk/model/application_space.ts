import { SdkErrorCode, SdkError } from '../error';
import { ReadApplicationSpaceResponse } from '../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../utils/utils';

export class ApplicationSpace {
  constructor(
    public id: string,
    public name: string,
    public customerId: string,
    public displayName: string,
    public issuerId: string,
    public etag: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
  ) {}

  static deserialize(response: ReadApplicationSpaceResponse): ApplicationSpace {
    if (!response.appSpace) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize application space");
    }

    return new ApplicationSpace(
      response.appSpace.id,
      response.appSpace.name,
      response.appSpace.customerId,
      response.appSpace.displayName,
      response.appSpace.issuerId,
      response.appSpace.etag,
      response.appSpace.description ? response.appSpace.description.value : undefined,
      Utils.timestampToDate(response.appSpace.createTime),
      Utils.timestampToDate(response.appSpace.updateTime),
      Utils.timestampToDate(response.appSpace.deleteTime),
      Utils.timestampToDate(response.appSpace.destroyTime),
    );
  }
}
