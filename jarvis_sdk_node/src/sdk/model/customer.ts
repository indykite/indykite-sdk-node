import { SdkErrorCode, SdkError } from './../error';
import { ReadCustomerResponse } from '../../grpc/indykite/config/v1beta1/config_management_api';
import { Utils } from '../utils/utils';

export class Customer {
  constructor(
    public id: string,
    public name: string,
    public displayName: string,
    public etag: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
  ) {}

  static deserialize(response: ReadCustomerResponse): Customer {
    if (!response.customer) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize customer");
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
    );
  }
}
