import { SdkErrorCode, SdkError } from '../error';
import {
  CreateApplicationResponse,
  ReadApplicationResponse,
} from '../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../utils/utils';

export class Application {
  constructor(
    public id: string,
    public name: string,
    public appSpaceId: string,
    public customerId?: string,
    public displayName?: string,
    public etag?: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
  ) {}

  static deserialize(
    response: CreateApplicationResponse,
    appSpaceId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): Application;
  static deserialize(response: ReadApplicationResponse): Application;
  static deserialize(
    response: CreateApplicationResponse & ReadApplicationResponse,
    appSpaceId?: string,
    name?: string,
    displayName?: string,
    description?: string,
  ): Application {
    if (response.application) {
      return new Application(
        response.application.id,
        response.application.name,
        response.application.appSpaceId,
        response.application.customerId,
        response.application.displayName,
        response.application.etag,
        response.application.description?.value,
        Utils.timestampToDate(response.application.createTime),
        Utils.timestampToDate(response.application.updateTime),
        Utils.timestampToDate(response.application.deleteTime),
        Utils.timestampToDate(response.application.destroyTime),
      );
    }

    if (!appSpaceId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize application");
    }

    return new Application(
      response.id,
      name,
      appSpaceId,
      undefined,
      displayName,
      response.etag,
      description,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
    );
  }
}
