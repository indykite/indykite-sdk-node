import { SdkErrorCode, SdkError } from '../../error';
import {
  CreateOAuth2ProviderResponse,
  ReadOAuth2ProviderResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { OAuth2ProviderConfig } from './oauth2_provider_config';
import { Utils } from '../../utils/utils';

type IOptions = {
  id: string;
  name: string;
  appSpaceId: string;
  displayName?: string;
  description?: string;
  etag?: string;
  createTime?: Date;
  updateTime?: Date;
  deleteTime?: Date;
  destroyTime?: Date;
  config?: OAuth2ProviderConfig;
  customerId?: string;
};

export class OAuth2Provider {
  public id = '';
  public name = '';
  public appSpaceId = '';

  constructor(
    id: string,
    name: string,
    appSpaceId: string,
    displayName?: string,
    description?: string,
    etag?: string,
    config?: OAuth2ProviderConfig,
    createTime?: Date,
    updateTime?: Date,
    deleteTime?: Date,
    destroyTime?: Date,
    customerId?: string,
  );
  constructor(options: IOptions);
  constructor(
    idOrOptions: string | IOptions,
    name?: string,
    appSpaceId?: string,
    public displayName?: string,
    public description?: string,
    public etag?: string,
    public config?: OAuth2ProviderConfig,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
    public customerId?: string,
  ) {
    if (typeof idOrOptions === 'string' && name !== undefined && appSpaceId !== undefined) {
      this.id = idOrOptions;
      this.name = name;
      this.appSpaceId = appSpaceId;
    }

    if (typeof idOrOptions === 'object') {
      this.id = idOrOptions.id;
      this.name = idOrOptions.name;
      this.etag = idOrOptions.etag;
      this.displayName = idOrOptions.displayName;
      this.description = idOrOptions.description;
      this.createTime = idOrOptions.createTime;
      this.updateTime = idOrOptions.updateTime;
      this.deleteTime = idOrOptions.deleteTime;
      this.destroyTime = idOrOptions.destroyTime;
      this.appSpaceId = idOrOptions.appSpaceId;
      this.config = idOrOptions.config;
      this.customerId = idOrOptions.customerId;
    }
  }

  static deserialize(
    response: CreateOAuth2ProviderResponse,
    name: string,
    appSpaceId: string,
    config: OAuth2ProviderConfig,
    displayName?: string,
    description?: string,
  ): OAuth2Provider;
  static deserialize(response: ReadOAuth2ProviderResponse): OAuth2Provider;
  static deserialize(
    response: CreateOAuth2ProviderResponse & ReadOAuth2ProviderResponse,
    name?: string,
    appSpaceId?: string,
    config?: OAuth2ProviderConfig,
    displayName?: string,
    description?: string,
  ): OAuth2Provider {
    if (response.oauth2Provider) {
      return OAuth2Provider.deserializeFromReadResponse(response.oauth2Provider);
    }

    if (!name || !config || !appSpaceId) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize OAuth2 provider");
    }

    return new OAuth2Provider(
      response.id,
      name,
      appSpaceId,
      displayName,
      description,
      response.etag,
      config,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
    );
  }

  private static deserializeFromReadResponse(
    oauth2Provider: NonNullable<ReadOAuth2ProviderResponse['oauth2Provider']>,
  ): OAuth2Provider {
    return new OAuth2Provider(
      oauth2Provider.id,
      oauth2Provider.name,
      oauth2Provider.appSpaceId,
      oauth2Provider.displayName,
      oauth2Provider.description?.value,
      oauth2Provider.etag,
      oauth2Provider.config && OAuth2ProviderConfig.deserialize(oauth2Provider.config),
      Utils.timestampToDate(oauth2Provider.createTime),
      Utils.timestampToDate(oauth2Provider.updateTime),
      Utils.timestampToDate(oauth2Provider.deleteTime),
      Utils.timestampToDate(oauth2Provider.destroyTime),
      oauth2Provider.customerId,
    );
  }
}
