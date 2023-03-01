import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  AuthenticatorAttachment,
  AuthFlowConfig_Format,
  AuthStyle,
  ConveyancePreference,
  IngestMappingConfig_Direction,
  ProviderType,
  UserVerificationRequirement,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ConfigurationFactory, ConfigurationType } from '../factory';
import { OAuth2Client } from '../oauth2_client/oauth2_client';
import { IngestMapping } from '../ingest_mapping/ingest_mapping';
import { IngestMappingEntityType } from '../ingest_mapping/ingest_mapping_entity';
import { WebAuthnProvider } from '../webauthn_provider';

describe('createInstance', () => {
  let instance: ConfigurationType;

  describe('when the kind is "webauthnProviderConfig"', () => {
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
          description: 'Instance description',
          etag: 'etag-token',
          id: 'instance-id',
          createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
          updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          tenantId: 'tenant-id',
        },
      );

      expect(typedInstance).toEqual(expectedInstance);
    });
  });

  describe('when the kind is "ingestMappingConfig"', () => {
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
          oneofKind: 'ingestMappingConfig',
          ingestMappingConfig: {
            ingestType: {
              oneofKind: 'upsert',
              upsert: {
                entities: [
                  {
                    externalId: {
                      isRequired: true,
                      mappedName: 'ExternalId',
                      sourceName: 'fodselsnummer',
                    },
                    labels: ['DigitalTwin'],
                    tenantId: 'gid:tenantId',
                    properties: [
                      {
                        isRequired: false,
                        mappedName: 'nickname',
                        sourceName: 'kallenavn',
                      },
                    ],
                    relationships: [
                      {
                        externalId: 'familienummer',
                        type: 'MEMBER_OF',
                        direction: IngestMappingConfig_Direction.INBOUND,
                        matchLabel: 'Family',
                      },
                      {
                        externalId: 'mors_fodselsnummer',
                        type: 'MOTHER_OF',
                        direction: IngestMappingConfig_Direction.OUTBOUND,
                        matchLabel: 'DigitalTwin',
                      },
                    ],
                  },
                  {
                    externalId: {
                      isRequired: true,
                      mappedName: 'ExternalId',
                      sourceName: 'familienummer',
                    },
                    labels: ['Family'],
                    tenantId: 'gid:tenantId',
                    properties: [],
                    relationships: [],
                  },
                ],
              },
            },
          },
        },
      });
    });

    it('creates a correct instance', () => {
      const typedInstance = instance as IngestMapping;

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
        upsertEntities: [
          {
            entityType: IngestMappingEntityType.UPSERT,
            externalId: {
              isRequired: true,
              mappedName: 'ExternalId',
              sourceName: 'fodselsnummer',
            },
            labels: ['DigitalTwin'],
            properties: [
              {
                isRequired: false,
                mappedName: 'nickname',
                sourceName: 'kallenavn',
              },
            ],
            relationships: [
              {
                direction: 1,
                externalId: 'familienummer',
                matchLabel: 'Family',
                type: 'MEMBER_OF',
              },
              {
                direction: 2,
                externalId: 'mors_fodselsnummer',
                matchLabel: 'DigitalTwin',
                type: 'MOTHER_OF',
              },
            ],
            tenantId: 'gid:tenantId',
          },
          {
            entityType: IngestMappingEntityType.UPSERT,
            externalId: {
              isRequired: true,
              mappedName: 'ExternalId',
              sourceName: 'familienummer',
            },
            labels: ['Family'],
            properties: [],
            relationships: [],
            tenantId: 'gid:tenantId',
          },
        ],
      });
    });
  });

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
        description: 'Instance description',
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
