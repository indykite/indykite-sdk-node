import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  AuthenticatorAttachment,
  AuthFlowConfig_Format,
  AuthStyle,
  ConveyancePreference,
  ProviderType,
  UserVerificationRequirement,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { SdkError, SkdErrorText, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ConfigNode } from '../config_node';
import { ConfigNodeFactory } from '../factory';
import { ConfigNodeType } from '../config_node';
import { OAuth2Client } from '../oauth2_client/oauth2_client';
import { WebAuthnProvider } from '../webauthn_provider';
import { AuthFlow } from '../authflow/flow';
import { EmailServiceConfigType } from '../email/factory';

describe('createInstance', () => {
  let instance: ConfigNodeType;

  describe('when the kind is "webauthnProviderConfig"', () => {
    beforeEach(() => {
      instance = ConfigNodeFactory.createInstance({
        displayName: 'Instance Name',
        description: StringValue.fromJson('Instance description'),
        etag: 'etag-token',
        id: 'instance-id',
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
        createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
        updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        config: {
          oneofKind: 'webauthnProviderConfig',
          webauthnProviderConfig: {
            attestationPreference: ConveyancePreference.DIRECT,
            authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
            relyingParties: {
              'http://localhost:3000': 'default',
            },
            requireResidentKey: true,
            userVerification: UserVerificationRequirement.REQUIRED,
            authenticationTimeout: { seconds: '60', nanos: 0 },
            registrationTimeout: { seconds: '2', nanos: 500000 },
          },
        },
      });
    });

    it('creates a correct instance', () => {
      const typedInstance = instance as WebAuthnProvider;
      const expectedInstance = Object.assign(
        new WebAuthnProvider({
          name: 'instance-name',
          attestationPreference: ConveyancePreference.DIRECT,
          authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
          relyingParties: {
            'http://localhost:3000': 'default',
          },
          requireResidentKey: true,
          userVerification: UserVerificationRequirement.REQUIRED,
          authenticationTimeout: 60,
          registrationTimeout: 2.5,
        }),
        {
          displayName: 'Instance Name',
          description: { value: 'Instance description' },
          etag: 'etag-token',
          id: 'instance-id',
          createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
          updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          tenantId: 'tenant-id',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
        },
      );

      expect(typedInstance).toEqual(expectedInstance);
    });
  });

  describe('when the kind is "oauth2ClientConfig"', () => {
    beforeEach(() => {
      instance = ConfigNodeFactory.createInstance({
        displayName: 'Instance Name',
        description: StringValue.fromJson('Instance description'),
        etag: 'etag-token',
        id: 'instance-id',
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
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
            privateKeyId: '',
            privateKeyPem: new Uint8Array(),
            teamId: '',
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
        description: { value: 'Instance description' },
        etag: 'etag-token',
        id: 'instance-id',
        createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
        updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        privateKeyId: '',
        privateKeyPem: Buffer.from(''),
        teamId: '',
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
      });
    });
  });

  describe('when the kind is "authFlowConfig"', () => {
    beforeEach(() => {
      instance = ConfigNodeFactory.createInstance({
        displayName: 'Instance Name',
        description: StringValue.fromJson('Instance description'),
        etag: 'etag-token',
        id: 'instance-id',
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
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
            default: false,
          },
        },
      });
    });

    it('creates a correct instance', () => {
      const typedInstance = instance as AuthFlow;

      expect(typedInstance).toEqual({
        displayName: 'Instance Name',
        description: { value: 'Instance description' },
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
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
      });
    });
  });

  describe('when the kind is "emailServiceConfig"', () => {
    beforeEach(() => {
      instance = ConfigNodeFactory.createInstance({
        displayName: 'Instance Name',
        etag: 'etag-token',
        id: 'instance-id',
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
        createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
        updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'instance-name',
        config: {
          oneofKind: 'emailServiceConfig',
          emailServiceConfig: {
            default: false,
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
      const typedInstance = instance as EmailServiceConfigType;

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
        createdBy: 'Lorem ipsum - creator',
        updatedBy: 'Lorem ipsum - updater',
      });
    });
  });

  describe('when the config is not present', () => {
    let caughtError: SdkError;

    beforeEach(() => {
      try {
        ConfigNodeFactory.createInstance({
          displayName: 'Instance Name',
          description: StringValue.fromJson('Instance description'),
          etag: 'etag-token',
          id: 'instance-id',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
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
      expect(caughtError.code).toBe(SdkErrorCode.SDK_CODE_2);
      expect(caughtError.message).toBe(SkdErrorText.SDK_CODE_2(ConfigNode.name, undefined));
    });
  });
});
