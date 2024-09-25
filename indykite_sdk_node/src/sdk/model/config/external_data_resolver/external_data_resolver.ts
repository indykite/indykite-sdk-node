import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  ExternalDataResolverConfig,
  ExternalDataResolverConfig_Header,
  ExternalDataResolverConfig_ContentType,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { ConfigNode } from '../config_node';

type IOptions = {
  name: string;
  displayName?: string;
  description?: StringValue;
  url: string;
  method: string;
  headers: { [key: string]: ExternalDataResolverConfig_Header };
  requestType: ExternalDataResolverConfig_ContentType;
  requestPayload: Uint8Array;
  responseType: ExternalDataResolverConfig_ContentType;
  responseSelector: string;
};

export { ExternalDataResolverConfig_ContentType, ExternalDataResolverConfig_Header };

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ExternalDataResolverConfig
 */
export class ExternalDataResolver extends ConfigNode {
  public url: string;
  public method: string;
  public headers: { [key: string]: ExternalDataResolverConfig_Header };
  public requestType: ExternalDataResolverConfig_ContentType;
  public requestPayload: Uint8Array;
  public responseType: ExternalDataResolverConfig_ContentType;
  public responseSelector: string;

  constructor(options: IOptions) {
    super(options.name);

    this.displayName = options.displayName;
    this.description = options.description;
    this.url = options.url;
    this.method = options.method;
    this.headers = options.headers;
    this.requestType = options.requestType;
    this.requestPayload = options.requestPayload;
    this.responseType = options.responseType;
    this.responseSelector = options.responseSelector;
  }

  marshal(): ExternalDataResolverConfig {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      requestType: this.requestType,
      requestPayload: this.requestPayload,
      responseType: this.responseType,
      responseSelector: this.responseSelector,
    };
  }
}
