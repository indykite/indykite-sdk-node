import { SdkErrorCode, SdkError } from '../../error';
import {
  CreateOAuth2ApplicationResponse,
  ReadOAuth2ApplicationResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { OAuth2ApplicationConfig } from './oauth2_application_config';
import { Utils } from '../../utils/utils';

type IOptions = {
  id: string;
  name: string;
  etag?: string;
  displayName?: string;
  description?: string;
  createTime?: Date;
  updateTime?: Date;
  deleteTime?: Date;
  destroyTime?: Date;
  customerId?: string;
  appSpaceId?: string;
  oauth2ProviderId?: string;
  config?: OAuth2ApplicationConfig;
};

export class OAuth2Application {
  public id = '';
  public name = '';

  constructor(
    id: string,
    name: string,
    etag?: string,
    displayName?: string,
    description?: string,
    createTime?: Date,
    updateTime?: Date,
    deleteTime?: Date,
    destroyTime?: Date,
    customerId?: string,
    appSpaceId?: string,
    oauth2ProviderId?: string,
    config?: OAuth2ApplicationConfig,
  );
  constructor(options: IOptions);
  constructor(
    idOrOptions: string | IOptions,
    name?: string,
    public etag?: string,
    public displayName?: string,
    public description?: string,
    public createTime?: Date,
    public updateTime?: Date,
    public deleteTime?: Date,
    public destroyTime?: Date,
    public customerId?: string,
    public appSpaceId?: string,
    public oauth2ProviderId?: string,
    public config?: OAuth2ApplicationConfig,
  ) {
    if (typeof idOrOptions === 'string' && name !== undefined) {
      this.id = idOrOptions;
      this.name = name;
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
      this.customerId = idOrOptions.customerId;
      this.appSpaceId = idOrOptions.appSpaceId;
      this.oauth2ProviderId = idOrOptions.oauth2ProviderId;
      this.config = idOrOptions.config;
    }
  }

  static deserialize(
    response: CreateOAuth2ApplicationResponse,
    name: string,
    config: OAuth2ApplicationConfig,
    displayName?: string,
    description?: string,
  ): OAuth2Application;
  static deserialize(response: ReadOAuth2ApplicationResponse): OAuth2Application;
  static deserialize(
    response: CreateOAuth2ApplicationResponse & ReadOAuth2ApplicationResponse,
    name?: string,
    config?: OAuth2ApplicationConfig,
    displayName?: string,
    description?: string,
  ): OAuth2Application {
    if (response.oauth2Application) {
      return OAuth2Application.deserializeFromReadResponse(response.oauth2Application);
    }

    if (!name || !config) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize OAuth2 application");
    }

    config.clientId = response.clientId;
    config.clientSecret = response.clientSecret;

    return new OAuth2Application(
      response.id,
      name,
      response.etag,
      displayName,
      description,
      Utils.timestampToDate(response.createTime),
      Utils.timestampToDate(response.updateTime),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      config,
    );
  }

  private static deserializeFromReadResponse(
    oauth2Application: NonNullable<ReadOAuth2ApplicationResponse['oauth2Application']>,
  ): OAuth2Application {
    return new OAuth2Application(
      oauth2Application.id,
      oauth2Application.name,
      oauth2Application.etag,
      oauth2Application.displayName,
      oauth2Application.description?.value,
      Utils.timestampToDate(oauth2Application.createTime),
      Utils.timestampToDate(oauth2Application.updateTime),
      Utils.timestampToDate(oauth2Application.deleteTime),
      Utils.timestampToDate(oauth2Application.destroyTime),
      oauth2Application.customerId,
      oauth2Application.appSpaceId,
      oauth2Application.oauth2ProviderId,
      oauth2Application.config && OAuth2ApplicationConfig.deserialize(oauth2Application.config),
    );
  }
}
