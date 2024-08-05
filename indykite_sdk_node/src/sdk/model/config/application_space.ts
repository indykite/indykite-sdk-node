// import { ApplicationSpace } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import {
  CreateApplicationSpaceResponse,
  ReadApplicationSpaceResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { AppSpaceIKGStatus } from '../../../grpc/indykite/config/v1beta1/model';
import { Utils } from '../../utils/utils';

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ApplicationSpace
 */
export class ApplicationSpace {
  constructor(
    // #1 Globally unique identifier.
    public id: string,
    // #2 Name is unique name of configuration object.
    public name: string,
    // #10 CustomerId this object is directly connected to.
    public customerId: string,
    // #9 Output only. Multiversion concurrency control version.
    public etag?: string,
    // #3 Human readable name of configuration.
    public displayName?: string,
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
    // #14 Output only. The status of the DB instance behind the Application Space.
    public ikgStatus?: AppSpaceIKGStatus,
    // #15 region in [europe-west1, us-east1]
    public region?: string,
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
        response.appSpace.description?.value ?? undefined,
        Utils.timestampToDate(response.appSpace.createTime),
        Utils.timestampToDate(response.appSpace.updateTime),
        Utils.timestampToDate(response.appSpace.deleteTime),
        Utils.timestampToDate(response.appSpace.destroyTime),
        response.appSpace.createdBy,
        response.appSpace.updatedBy,
        response.appSpace.ikgStatus,
        response.appSpace.region,
      );
    }

    if (!customerId || !name) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, SkdErrorText.SDK_CODE_1(ApplicationSpace.name));
    }

    return new ApplicationSpace(
      response.id,
      name,
      customerId,
      response.etag,
      displayName,
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
