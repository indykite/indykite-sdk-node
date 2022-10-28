import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateConfigNodeResponse,
  DeleteConfigNodeResponse,
  ReadConfigNodeResponse,
  UpdateConfigNodeResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { IngestMapping } from '../../model/config/ingest_mapping/ingest_mapping';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import {
  IngestMappingEntity,
  IngestMappingEntityType,
  IngestMappingRelationshipDirection,
} from '../../model/config/ingest_mapping/ingest_mapping_entity';

let configExample: IngestMapping;

beforeEach(() => {
  configExample = new IngestMapping({
    name: 'ingest-mapping-name',
    entities: [
      new IngestMappingEntity({
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
            direction: IngestMappingRelationshipDirection.INBOUND,
            matchLabel: 'Family',
          },
          {
            externalId: 'mors_fodselsnummer',
            type: 'MOTHER_OF',
            direction: IngestMappingRelationshipDirection.OUTBOUND,
            matchLabel: 'DigitalTwin',
          },
        ],
      }).withType(IngestMappingEntityType.UPSERT),
    ],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createIngestMappingConfiguration', () => {
  describe('when no error is returned', () => {
    let ingestMapping: IngestMapping;
    let createConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      createConfigNodeSpy = jest
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-ingest-mapping-id',
                etag: 'etag-token',
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 5))),
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 6))),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        ingestMapping = await sdk.createIngestMappingConfiguration('location-id', configExample);
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'ingest-mapping-name',
            location: 'location-id',
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
                    ],
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(ingestMapping.id).toBe('new-ingest-mapping-id');
        expect(ingestMapping.etag).toBe('etag-token');
        expect(ingestMapping.name).toBe('ingest-mapping-name');
        expect(ingestMapping.displayName).toBeUndefined();
        expect(ingestMapping.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'Ingest Mapping Name';
        configExample.description = 'Ingest Mapping description';
        ingestMapping = await sdk.createIngestMappingConfiguration('location-id', configExample);
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'ingest-mapping-name',
            displayName: StringValue.fromJson('Ingest Mapping Name'),
            description: StringValue.fromJson('Ingest Mapping description'),
            location: 'location-id',
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
                    ],
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(ingestMapping.id).toBe('new-ingest-mapping-id');
        expect(ingestMapping.etag).toBe('etag-token');
        expect(ingestMapping.name).toBe('ingest-mapping-name');
        expect(ingestMapping.displayName).toBe('Ingest Mapping Name');
        expect(ingestMapping.description).toBe('Ingest Mapping description');
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.createIngestMappingConfiguration('location-id', configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.createIngestMappingConfiguration('location-id', configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ingest mapping response');
    });
  });
});

describe('readIngestMappingConfiguration', () => {
  describe('when no error is returned', () => {
    let ingestMapping: IngestMapping;
    let readConfigNodeSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readConfigNodeSpy = jest
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                configNode: {
                  displayName: 'Ingest mapping name',
                  description: StringValue.fromJson('Ingest mapping description'),
                  etag: 'etag-token',
                  id: 'ingest-mapping-id',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  tenantId: 'tenant-id',
                  name: 'ingest-mapping-name',
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
                          ],
                        },
                      },
                    },
                  },
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      ingestMapping = await sdk.readIngestMappingConfiguration('ingest-mapping-id-request');
    });

    it('sends correct request', () => {
      expect(readConfigNodeSpy).toBeCalledWith(
        {
          id: 'ingest-mapping-id-request',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(ingestMapping).toEqual({
        appSpaceId: 'app-space-id',
        createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
        customerId: 'customer-id',
        description: 'Ingest mapping description',
        displayName: 'Ingest mapping name',
        etag: 'etag-token',
        id: 'ingest-mapping-id',
        name: 'ingest-mapping-name',
        tenantId: 'tenant-id',
        updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
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
                direction: IngestMappingRelationshipDirection.INBOUND,
                externalId: 'familienummer',
                matchLabel: 'Family',
                type: 'MEMBER_OF',
              },
              {
                direction: IngestMappingRelationshipDirection.OUTBOUND,
                externalId: 'mors_fodselsnummer',
                matchLabel: 'DigitalTwin',
                type: 'MOTHER_OF',
              },
            ],
            tenantId: 'gid:tenantId',
          },
        ],
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readIngestMappingConfiguration('ingest-mapping-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readIngestMappingConfiguration('ingest-mapping-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('config_error_read_ingestmappingconfiguration');
    });
  });
});

describe('updateIngestMappingConfiguration', () => {
  describe('when no error is returned', () => {
    let updatedIngestMapping: IngestMapping;
    let updateConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateConfigNodeSpy = jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-token',
                id: 'ingest-mapping-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        configExample.id = 'ingest-mapping-id';
        updatedIngestMapping = await sdk.updateIngestMappingConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'ingest-mapping-id',
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
                    ],
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedIngestMapping).toEqual({
          description: undefined,
          displayName: undefined,
          etag: 'new-etag-token',
          id: 'ingest-mapping-id',
          name: 'ingest-mapping-name',
          updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
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
                  direction: IngestMappingRelationshipDirection.INBOUND,
                  externalId: 'familienummer',
                  matchLabel: 'Family',
                  type: 'MEMBER_OF',
                },
                {
                  direction: IngestMappingRelationshipDirection.OUTBOUND,
                  externalId: 'mors_fodselsnummer',
                  matchLabel: 'DigitalTwin',
                  type: 'MOTHER_OF',
                },
              ],
              tenantId: 'gid:tenantId',
            },
          ],
        });
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'Ingest mapping name';
        configExample.description = 'Ingest mapping description';
        configExample.id = 'ingest-mapping-id';
        configExample.etag = 'etag-token';
        updatedIngestMapping = await sdk.updateIngestMappingConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'ingest-mapping-id',
            description: StringValue.fromJson('Ingest mapping description'),
            displayName: StringValue.fromJson('Ingest mapping name'),
            etag: StringValue.fromJson('etag-token'),
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
                    ],
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedIngestMapping).toEqual({
          description: 'Ingest mapping description',
          displayName: 'Ingest mapping name',
          etag: 'new-etag-token',
          id: 'ingest-mapping-id',
          name: 'ingest-mapping-name',
          updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
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
                  direction: IngestMappingRelationshipDirection.INBOUND,
                  externalId: 'familienummer',
                  matchLabel: 'Family',
                  type: 'MEMBER_OF',
                },
                {
                  direction: IngestMappingRelationshipDirection.OUTBOUND,
                  externalId: 'mors_fodselsnummer',
                  matchLabel: 'DigitalTwin',
                  type: 'MOTHER_OF',
                },
              ],
              tenantId: 'gid:tenantId',
            },
          ],
        });
      });
    });
  });

  describe('when a different ingest mapping is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-ingest-mapping-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'ingest-mapping-id';
      return sdk
        .updateIngestMappingConfiguration(configExample)
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=ingest-mapping-id, res.id=different-ingest-mapping-id',
      );
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'ingest-mapping-id';
      sdk.updateIngestMappingConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'ingest-mapping-id';
      sdk.updateIngestMappingConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=ingest-mapping-id, res.id=undefined',
      );
    });
  });
});

describe('deleteIngestMappingConfiguration', () => {
  describe('when no error is returned', () => {
    let deleteConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: boolean;

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
        deleteConfigNodeSpy = jest
          .spyOn(sdk['client'], 'deleteConfigNode')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: DeleteConfigNodeResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  id: 'ingest-mapping-id',
                  etag: 'etag-id',
                });
              }
              return {} as SurfaceCall;
            },
          );
        configExample.id = 'ingest-mapping-id';
        returnedValue = await sdk.deleteIngestMappingConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'ingest-mapping-id',
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).toBe(true);
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
        deleteConfigNodeSpy = jest
          .spyOn(sdk['client'], 'deleteConfigNode')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: DeleteConfigNodeResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  id: 'ingest-mapping-id',
                  etag: 'new-etag-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        configExample.id = 'ingest-mapping-id';
        configExample.etag = 'etag-token';
        returnedValue = await sdk.deleteIngestMappingConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'ingest-mapping-id',
            etag: StringValue.fromJson('etag-token'),
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).toBe(true);
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'ingest-mapping-id';
      sdk.deleteIngestMappingConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
