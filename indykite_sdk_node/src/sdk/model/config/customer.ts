// import { Customer } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import { ReadCustomerResponse } from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../../utils/utils';

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.Customer
 */
export class Customer {
  constructor(
    // #1 Globally unique identifier.
    public id: string,
    // #2 Name is unique name of configuration object.
    public name: string,
    // #3 Human readable name of configuration.
    public displayName: string,
    // #9 Output only. Multiversion concurrency control version.
    public etag: string,
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
    // #10 Output only. The user/service id who created the configuration.
    public createdBy?: string,
    // #11 Output only. The user/service id who last changed the configuration.
    public updatedBy?: string,
  ) {}

  static deserialize(response: ReadCustomerResponse): Customer {
    if (!response.customer) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, SkdErrorText.SDK_CODE_1(Customer.name));
    }

    return new Customer(
      response.customer.id,
      response.customer.name,
      response.customer.displayName,
      response.customer.etag,
      response.customer.description?.value,
      Utils.timestampToDate(response.customer.createTime),
      Utils.timestampToDate(response.customer.updateTime),
      Utils.timestampToDate(response.customer.deleteTime),
      Utils.timestampToDate(response.customer.destroyTime),
      response.customer.createdBy,
      response.customer.updatedBy,
    );
  }
}
