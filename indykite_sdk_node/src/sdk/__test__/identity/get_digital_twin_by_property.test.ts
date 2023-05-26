import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { GetDigitalTwinResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import {
  IdentityTokenInfo,
  ProviderType,
  DigitalTwinState,
  DigitalTwinKind,
  DigitalEntity,
} from '../../../grpc/indykite/identity/v1beta2/model';
import { DigitalTwin } from '../../model';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { Utils } from '../../utils/utils';
import { IdentityClient } from './../../identity';

describe('getDigitalTwinByProperty', () => {
  describe('when no error is returned', () => {
    const dt = {
      id: generateRandomGID(),
      tenantId: generateRandomGID(),
      state: DigitalTwinState.ACTIVE,
      kind: DigitalTwinKind.PERSON,
      tags: [],
    };
    const dtCreateTime = new Date();
    let getDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClient;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      getDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                digitalTwin: {
                  properties: [],
                  createTime: Utils.dateToTimestamp(dtCreateTime),
                  digitalTwin: dt,
                } as DigitalEntity,
                tokenInfo: {
                  customerId: generateRandomGID(),
                  appSpaceId: generateRandomGID(),
                  applicationId: generateRandomGID(),
                  authenticationTime: Utils.dateToTimestamp(new Date()),
                  expireTime: Utils.dateToTimestamp(new Date(Date.now() + 20 * 3600 * 1000)),
                  issueTime: Utils.dateToTimestamp(new Date()),
                  providerInfo: [
                    {
                      issuer: 'indykite.id',
                      type: ProviderType.PASSWORD,
                    },
                  ],
                  subject: dt,
                } as IdentityTokenInfo,
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      const tenantId = generateRandomGID();
      let digitalTwin: unknown;

      beforeEach(async () => {
        digitalTwin = await sdk.getDigitalTwinByProperty(tenantId, 'propName', 'propValue');
      });

      it('sends correct request', () => {
        expect(getDigitalTwinSpy).toBeCalledWith(
          {
            id: {
              filter: {
                oneofKind: 'propertyFilter',
                propertyFilter: {
                  tenantId,
                  type: 'propName',
                  value: {
                    value: {
                      oneofKind: 'stringValue',
                      stringValue: 'propValue',
                    },
                  },
                },
              },
            },
            properties: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(digitalTwin).toEqual({
          digitalTwin: new DigitalTwin(dt.id, dt.tenantId, dt.kind, dt.state, [], dtCreateTime),
          tokenInfo: {
            appSpaceId: expect.any(String),
            applicationId: expect.any(String),
            authenticationTime: expect.any(Date),
            customerId: expect.any(String),
            expireTime: expect.any(Date),
            issueTime: expect.any(Date),
            providerInfo: [
              {
                issuer: 'indykite.id',
                type: 'password',
              },
            ],
            subject: dt,
          },
        });
      });
    });

    describe('when all possible values are sent', () => {
      const tenantId = generateRandomGID();
      let digitalTwin: unknown;

      beforeEach(async () => {
        getDigitalTwinSpy = jest
          .spyOn(sdk['client'], 'getDigitalTwin')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  digitalTwin: {
                    properties: [
                      {
                        id: generateRandomGID(),
                        value: {
                          oneofKind: 'objectValue',
                          objectValue: {
                            value: {
                              oneofKind: 'stringValue',
                              stringValue: 'user@example.com',
                            },
                          },
                        },
                        definition: {
                          property: 'email',
                          context: 'http://schema.org',
                          type: 'Person',
                        },
                      },
                    ],
                    createTime: Utils.dateToTimestamp(dtCreateTime),
                    digitalTwin: dt,
                  } as DigitalEntity,
                  tokenInfo: {
                    customerId: generateRandomGID(),
                    appSpaceId: generateRandomGID(),
                    applicationId: generateRandomGID(),
                    authenticationTime: Utils.dateToTimestamp(new Date()),
                    expireTime: Utils.dateToTimestamp(new Date(Date.now() + 20 * 3600 * 1000)),
                    issueTime: Utils.dateToTimestamp(new Date()),
                    providerInfo: [
                      {
                        issuer: 'indykite.id',
                        type: ProviderType.PASSWORD,
                      },
                    ],
                    subject: dt,
                  } as IdentityTokenInfo,
                });
              }
              return {} as SurfaceCall;
            },
          );

        digitalTwin = await sdk.getDigitalTwinByProperty(tenantId, 'propName', 'propValue', [
          'email',
        ]);
      });

      it('sends correct request', () => {
        expect(getDigitalTwinSpy).toBeCalledWith(
          {
            id: {
              filter: {
                oneofKind: 'propertyFilter',
                propertyFilter: {
                  tenantId,
                  type: 'propName',
                  value: {
                    value: {
                      oneofKind: 'stringValue',
                      stringValue: 'propValue',
                    },
                  },
                },
              },
            },
            properties: [
              {
                definition: {
                  context: '',
                  property: 'email',
                  type: '',
                },
              },
            ],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        const expectedDigitalTwin = DigitalTwin.deserialize({
          digitalTwin: {
            digitalTwin: dt,
            properties: [
              {
                id: expect.any(String),
                value: {
                  oneofKind: 'objectValue',
                  objectValue: {
                    value: {
                      oneofKind: 'stringValue',
                      stringValue: 'user@example.com',
                    },
                  },
                },
                definition: {
                  property: 'email',
                  context: 'http://schema.org',
                  type: 'Person',
                },
              },
            ],
            createTime: Utils.dateToTimestamp(dtCreateTime),
          },
        });

        expect(digitalTwin).toEqual({
          digitalTwin: expectedDigitalTwin,
          tokenInfo: {
            appSpaceId: expect.any(String),
            applicationId: expect.any(String),
            authenticationTime: expect.any(Date),
            customerId: expect.any(String),
            expireTime: expect.any(Date),
            issueTime: expect.any(Date),
            providerInfo: [
              {
                issuer: 'indykite.id',
                type: 'password',
              },
            ],
            subject: dt,
          },
        });
      });
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.getDigitalTwinByProperty(generateRandomGID(), 'propName', 'propValue').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    const tenantId = generateRandomGID();
    let digitalTwin: unknown;
    let getDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClient;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      getDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      digitalTwin = await sdk.getDigitalTwinByProperty(tenantId, 'propName', 'propValue');
    });

    it('sends correct request', () => {
      expect(getDigitalTwinSpy).toBeCalledWith(
        {
          id: {
            filter: {
              oneofKind: 'propertyFilter',
              propertyFilter: {
                tenantId,
                type: 'propName',
                value: {
                  value: {
                    oneofKind: 'stringValue',
                    stringValue: 'propValue',
                  },
                },
              },
            },
          },
          properties: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(digitalTwin).toEqual({});
    });
  });
});
