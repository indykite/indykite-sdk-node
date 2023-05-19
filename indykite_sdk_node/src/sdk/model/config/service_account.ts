import {
  CreateServiceAccountResponse,
  ReadServiceAccountResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';

export enum ServiceAccountRole {
  ALL_EDITOR = 'all_editor',
  ALL_VIEWER = 'all_viewer',
}

type IOptions = {
  id: string;
  name: string;
  etag?: string;
  customerId?: string;
  appSpaceId?: string;
  createTime?: Date;
  updateTime?: Date;
  deleteTime?: Date;
  destroyTime?: Date;
  displayName?: string;
  description?: string;
};

export class ServiceAccount {
  public id = '';
  public name = '';

  constructor(
    id: string,
    name: string,
    etag?: string,
    /**
     * This value is not known after the service account creation.
     */
    customerId?: string,
    /**
     * This value is not known after the service account creation.
     */
    appSpaceId?: string,
    createTime?: Date,
    updateTime?: Date,
    deleteTime?: Date,
    destroyTime?: Date,
    displayName?: string,
    description?: string,
  );
  constructor(options: IOptions);
  constructor(
    idOrOptions: string | IOptions,
    name?: string,
    public etag?: string,
    /**
     * This value is not known after the service account creation.
     */
    public customerId?: string,
    /**
     * This value is not known after the service account creation.
     */
    public appSpaceId?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
    public displayName?: string,
    public description?: string,
  ) {
    if (typeof idOrOptions === 'string' && name !== undefined) {
      this.id = idOrOptions;
      this.name = name;
    }

    if (typeof idOrOptions === 'object') {
      this.id = idOrOptions.id;
      this.name = idOrOptions.name;
      this.etag = idOrOptions.etag;
      this.customerId = idOrOptions.customerId;
      this.appSpaceId = idOrOptions.appSpaceId;
      this.createTime = idOrOptions.createTime;
      this.updateTime = idOrOptions.updateTime;
      this.deleteTime = idOrOptions.deleteTime;
      this.destroyTime = idOrOptions.destroyTime;
      this.displayName = idOrOptions.displayName;
      this.description = idOrOptions.description;
    }
  }

  static deserialize(
    response: CreateServiceAccountResponse,
    name: string,
    displayName?: string,
    description?: string,
  ): ServiceAccount;
  static deserialize(response: ReadServiceAccountResponse): ServiceAccount;
  static deserialize(
    response: CreateServiceAccountResponse & ReadServiceAccountResponse,
    name?: string,
    displayName?: string,
    description?: string,
  ): ServiceAccount {
    if (response.serviceAccount) {
      return ServiceAccount.deserializeFromReadResponse(response.serviceAccount);
    }

    if (name === undefined) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize service account");
    }

    return new ServiceAccount(
      response.id,
      name,
      response.etag,
      undefined,
      undefined,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
      undefined,
      undefined,
      displayName,
      description,
    );
  }

  private static deserializeFromReadResponse(
    serviceAccount: NonNullable<ReadServiceAccountResponse['serviceAccount']>,
  ): ServiceAccount {
    return new ServiceAccount(
      serviceAccount.id,
      serviceAccount.name,
      serviceAccount.etag,
      serviceAccount.customerId,
      serviceAccount.appSpaceId,
      Utils.timestampToDate(serviceAccount.createTime),
      Utils.timestampToDate(serviceAccount.updateTime),
      Utils.timestampToDate(serviceAccount.deleteTime),
      Utils.timestampToDate(serviceAccount.destroyTime),
      serviceAccount.displayName,
      serviceAccount.description?.value,
    );
  }
}
