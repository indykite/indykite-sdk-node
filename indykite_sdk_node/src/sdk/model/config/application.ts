// import { Application } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import {
  CreateApplicationResponse,
  ReadApplicationResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.Application
 */
export class Application {
  constructor(
    // #1 Globally unique identifier.
    public id: string,
    // #2 Name is unique name of configuration object.
    public name: string,
    // #11 AppSpaceId this object is directly or indirectly connected to.
    public appSpaceId: string,
    // #10 CustomerId this object is directly or indirectly connected to.
    public customerId?: string,
    // #3 Human readable name of configuration.
    public displayName?: string,
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
    // #12 Output only. The user/service id who created the configuration.
    public createdBy?: string,
    // #13 Output only. The user/service id who last changed the configuration.
    public updatedBy?: string,
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
        response.application.createdBy,
        response.application.updatedBy,
      );
    }

    if (!appSpaceId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, SkdErrorText.SDK_CODE_1(Application.name));
    }

    return new Application(
      response.id,
      name,
      appSpaceId,
      undefined, // customerId
      displayName,
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
