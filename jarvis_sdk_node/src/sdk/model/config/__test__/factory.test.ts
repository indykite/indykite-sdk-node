import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  AuthFlowConfig_Format,
  AuthStyle,
  ProviderType,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ConfigurationFactory, ConfigurationType } from '../factory';
import { OAuth2Client } from '../oauth2_client/oauth2_client';

describe('createInstance', () => {
  let instance: ConfigurationType;

  describe('when the kind is "oauth2ClientConfig"', () => {
    beforeEach(() => {
      instance = ConfigurationFactory.createInstance({
        displayName: 'Instance Name',
        description: StringValue.fromJson('Instance description'),
        etag: 'etag-token',
        id: 'instance-id',
        createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
        updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        config: {
          oneofKind: 'oauth2ClientConfig',
          oauth2ClientConfig: {
            providerType: ProviderType.LINKEDIN_COM,
            clientId: 'client-id',
            clientSecret: 'client-secret',
            redirectUri: ['https://example.com/page'],
            defaultScopes: ['openid'],
            allowedScopes: ['openid', 'email'],
            allowSignup: true,
            issuer: 'issuer',
            authorizationEndpoint: 'https://example.com/authorization',
            tokenEndpoint: 'https://example.com/token',
            discoveryUrl: 'https://example.com/discovery',
            userinfoEndpoint: 'https://example.com/info',
            jwksUri: 'https://example.com/jwks',
            imageUrl: 'https://example.com/image.png',
            tenant: 'tenant',
            hostedDomain: 'https://example.com',
            authStyle: AuthStyle.AUTO_DETECT,
          },
        },
      });
    });

    it('creates a correct instance', () => {
      const typedInstance = instance as OAuth2Client;

      expect(typedInstance).toEqual({
        providerType: ProviderType.LINKEDIN_COM,
        clientId: 'client-id',
        clientSecret: 'client-secret',
        redirectUri: ['https://example.com/page'],
        defaultScopes: ['openid'],
        allowedScopes: ['openid', 'email'],
        allowSignup: true,
        issuer: 'issuer',
        authorizationEndpoint: 'https://example.com/authorization',
        tokenEndpoint: 'https://example.com/token',
        discoveryUrl: 'https://example.com/discovery',
        userinfoEndpoint: 'https://example.com/info',
        jwksUri: 'https://example.com/jwks',
        imageUrl: 'https://example.com/image.png',
        tenant: 'tenant',
        hostedDomain: 'https://example.com',
        authStyle: AuthStyle.AUTO_DETECT,
        displayName: 'Instance Name',
        description: 'Instance description',
        etag: 'etag-token',
        id: 'instance-id',
        createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
        updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
      });
    });
  });

  describe('when the kind is "authFlowConfig"', () => {
    beforeEach(() => {
      instance = ConfigurationFactory.createInstance({
        displayName: 'Instance Name',
        description: StringValue.fromJson('Instance description'),
        etag: 'etag-token',
        id: 'instance-id',
        createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
        updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        config: {
          oneofKind: 'authFlowConfig',
          authFlowConfig: {
            source: Buffer.from('{}'),
            sourceFormat: AuthFlowConfig_Format.BARE_JSON,
          },
        },
      });
    });

    it('creates a correct instance', () => {
      const typedInstance = instance as OAuth2Client;

      expect(typedInstance).toEqual({
        displayName: 'Instance Name',
        description: 'Instance description',
        etag: 'etag-token',
        id: 'instance-id',
        createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
        updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        defaultFlow: false,
        type: AuthFlowConfig_Format.BARE_JSON,
        source: Buffer.from('{}'),
      });
    });
  });

  describe('when the kind is "emailServiceConfig"', () => {
    beforeEach(() => {
      instance = ConfigurationFactory.createInstance({
        displayName: 'Instance Name',
        etag: 'etag-token',
        id: 'instance-id',
        createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
        updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        config: {
          oneofKind: 'emailServiceConfig',
          emailServiceConfig: {
            provider: {
              oneofKind: 'sendgrid',
              sendgrid: {
                apiKey: 'sdfsdfsdf',
                sandboxMode: false,
                host: StringValue.fromJson('https://example.com/mail'),
              },
            },
          },
        },
      });
    });

    it('creates a correct instance', () => {
      const typedInstance = instance as OAuth2Client;

      expect(typedInstance).toEqual({
        displayName: 'Instance Name',
        etag: 'etag-token',
        id: 'instance-id',
        createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
        updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        apiKey: 'sdfsdfsdf',
        host: StringValue.fromJson('https://example.com/mail'),
        sandboxMode: false,
      });
    });
  });

  describe('when the config is not present', () => {
    let caughtError: SdkError;

    beforeEach(() => {
      try {
        ConfigurationFactory.createInstance({
          displayName: 'Instance Name',
          description: StringValue.fromJson('Instance description'),
          etag: 'etag-token',
          id: 'instance-id',
          createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          tenantId: 'tenant-id',
          name: 'instance-name',
          config: {
            oneofKind: undefined,
          },
        });
      } catch (err) {
        caughtError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(caughtError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toBe("can't unmarshal configuration: undefined");
    });
  });
});
