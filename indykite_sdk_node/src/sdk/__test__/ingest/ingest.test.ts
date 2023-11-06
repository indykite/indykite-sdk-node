import { EventEmitter } from 'events';
import { SdkClient } from '../../client/client';
import { IngestClient, IngestRecord } from '../../ingest';
import { applicationTokenMock } from '../../utils/test_utils';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import {
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsResponse,
} from '../../../grpc/indykite/ingest/v1beta2/ingest_api';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Record } from '../../../grpc/indykite/ingest/v1beta2/model';

class ClientMock extends EventEmitter {
  end() {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  write(_: { record: { id: string } }) {
    throw new Error('Not implemented');
  }
}

jest.mock('../../utils/stream', () => {
  let input: ClientMock;
  let output: ClientMock;

  return {
    streamKeeper: () => {
      if (!input || !output) {
        input = new ClientMock();
        output = new ClientMock();
      }

      return [input, output];
    },
    IndexFixer: class {},
  };
});

let sdk: IngestClient;

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(console, 'error').mockImplementation();
});

beforeEach(async () => {
  sdk = new IngestClient({ client: { streamRecords: jest.fn() } } as unknown as SdkClient);
});

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  (console.log as unknown as jest.SpyInstance).mockRestore();
  (console.error as unknown as jest.SpyInstance).mockRestore();
});

describe('ingestRecord', () => {
  let record: Record;
  let response: IngestRecordResponse | undefined;

  beforeEach(() => {
    record = IngestRecord.upsert('record-id')
      .node.resource({
        externalId: 'lot-1',
        type: 'ParkingLot',
      })
      .getRecord();
    response = undefined;
  });

  describe('when no error is returned', () => {
    let ingestRecordSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      ingestRecordSpy = jest
        .spyOn(sdk['client'], 'ingestRecord')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: IngestRecordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                error: {
                  oneofKind: undefined,
                },
                recordId: 'record-id',
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.ingestRecord(record);
    });

    it('sends correct request', () => {
      expect(ingestRecordSpy).toBeCalledWith(
        {
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'upsert',
              upsert: {
                data: {
                  oneofKind: 'node',
                  node: {
                    type: {
                      oneofKind: 'resource',
                      resource: {
                        externalId: 'lot-1',
                        type: 'ParkingLot',
                        tags: [],
                        properties: [],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(response?.error.oneofKind).toBeUndefined();
      expect(response?.recordId).toBe('record-id');
    });
  });

  describe('when the response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'ingestRecord')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: IngestRecordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.ingestRecord(record).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'ingestRecord')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: IngestRecordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.ingestRecord(record).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('streamRecords', () => {
  let returnedData: StreamRecordsResponse[] = [];
  let streamRecordsSpy: jest.SpyInstance;

  beforeEach(async () => {
    streamRecordsSpy = jest.spyOn(sdk, 'streamRecords').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([
          {
            error: {
              oneofKind: undefined,
            },
            recordId: 'lot-1',
          } as StreamRecordsResponse,
          {
            error: {
              oneofKind: undefined,
            },
            recordId: 'lot-2',
          } as StreamRecordsResponse,
        ] as StreamRecordsResponse[]);
      });
    });

    returnedData = await sdk.streamRecords([
      IngestRecord.upsert('record-1')
        .node.resource({
          externalId: 'lot-1',
          type: 'ParkingLot',
        })
        .getRecord(),
      IngestRecord.upsert('record-2')
        .node.resource({
          externalId: 'lot-2',
          type: 'ParkingLot',
        })
        .getRecord(),
    ]);
  });

  it('sends a correct request', () => {
    expect(streamRecordsSpy).toBeCalledTimes(1);
  });

  it('returns correct response', () => {
    expect(returnedData).toEqual([
      {
        error: {
          oneofkind: undefined,
        },
        recordId: 'lot-1',
      },
      {
        error: {
          oneofkind: undefined,
        },
        recordId: 'lot-2',
      },
    ]);
  });
});

describe('IngestRecord builder', () => {
  it('empty', () => {
    expect(new IngestRecord().marshal()).toEqual({
      record: undefined,
    });
  });

  describe('upsert', () => {
    it('no more details', () => {
      expect(IngestRecord.upsert('record-id').marshal()).toEqual({
        record: {
          id: 'record-id',
          operation: {
            oneofKind: 'upsert',
            upsert: {
              data: {
                oneofKind: undefined,
              },
            },
          },
        },
      });
    });

    describe('relation', () => {
      it('no record', () => {
        const upsert = IngestRecord.upsert('record-id');
        const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;
        upsertRequest.record = undefined;

        expect(
          upsert
            .relation({
              sourceMatch: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              targetMatch: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CanUse',
            })
            .marshal(),
        ).toEqual({
          record: undefined,
        });
      });

      it('no operation', () => {
        const upsert = IngestRecord.upsert('record-id');
        const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;

        if (!upsertRequest.record) {
          throw new Error('Record must be defined');
        }
        upsertRequest.record.operation = { oneofKind: undefined };

        expect(
          upsert
            .relation({
              sourceMatch: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              targetMatch: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CanUse',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: undefined,
            },
          },
        });
      });

      it('with operation', () => {
        const upsert = IngestRecord.upsert('record-id');

        expect(
          upsert
            .relation({
              sourceMatch: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              targetMatch: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CanUse',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'upsert',
              upsert: {
                data: {
                  oneofKind: 'relation',
                  relation: {
                    match: {
                      sourceMatch: {
                        externalId: 'vehicle-1',
                        type: 'Vehicle',
                      },
                      targetMatch: {
                        externalId: 'lot-1',
                        type: 'ParkingLot',
                      },
                      type: 'CanUse',
                    },
                    properties: [],
                  },
                },
              },
            },
          },
        });

        expect(
          upsert
            .relation(
              {
                sourceMatch: {
                  externalId: 'vehicle-1',
                  type: 'Vehicle',
                },
                targetMatch: {
                  externalId: 'lot-1',
                  type: 'ParkingLot',
                },
                type: 'CanUse',
              },
              {
                propertyKey: 'propertyValue',
              },
            )
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'upsert',
              upsert: {
                data: {
                  oneofKind: 'relation',
                  relation: {
                    match: {
                      sourceMatch: {
                        externalId: 'vehicle-1',
                        type: 'Vehicle',
                      },
                      targetMatch: {
                        externalId: 'lot-1',
                        type: 'ParkingLot',
                      },
                      type: 'CanUse',
                    },
                    properties: [
                      {
                        key: 'propertyKey',
                        value: {
                          value: {
                            oneofKind: 'stringValue',
                            stringValue: 'propertyValue',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        });
      });
    });

    describe('node', () => {
      describe('resource', () => {
        it('no record', () => {
          const upsert = IngestRecord.upsert('record-id');
          const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;
          upsertRequest.record = undefined;

          expect(
            upsert.node
              .resource({
                externalId: 'lot-1',
                type: 'ParkingLot',
              })
              .marshal(),
          ).toEqual({
            record: undefined,
          });
        });

        it('no operation', () => {
          const upsert = IngestRecord.upsert('record-id');
          const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;

          if (!upsertRequest.record) {
            throw new Error('Record must be defined');
          }
          upsertRequest.record.operation = { oneofKind: undefined };

          expect(
            upsert.node
              .resource({
                externalId: 'lot-1',
                type: 'ParkingLot',
              })
              .marshal(),
          ).toEqual({
            record: {
              id: 'record-id',
              operation: {
                oneofKind: undefined,
              },
            },
          });
        });

        it('with operation', () => {
          const upsert = IngestRecord.upsert('record-id');

          expect(
            upsert.node
              .resource({
                externalId: 'lot-1',
                type: 'ParkingLot',
              })
              .marshal(),
          ).toEqual({
            record: {
              id: 'record-id',
              operation: {
                oneofKind: 'upsert',
                upsert: {
                  data: {
                    oneofKind: 'node',
                    node: {
                      type: {
                        oneofKind: 'resource',
                        resource: {
                          externalId: 'lot-1',
                          type: 'ParkingLot',
                          tags: [],
                          properties: [],
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          expect(
            upsert.node
              .resource({
                externalId: 'lot-1',
                type: 'ParkingLot',
                tags: ['MyTag'],
                properties: {
                  propertyKey: 'property-value',
                },
              })
              .marshal(),
          ).toEqual({
            record: {
              id: 'record-id',
              operation: {
                oneofKind: 'upsert',
                upsert: {
                  data: {
                    oneofKind: 'node',
                    node: {
                      type: {
                        oneofKind: 'resource',
                        resource: {
                          externalId: 'lot-1',
                          type: 'ParkingLot',
                          tags: ['MyTag'],
                          properties: [
                            {
                              key: 'propertyKey',
                              value: {
                                value: {
                                  oneofKind: 'stringValue',
                                  stringValue: 'property-value',
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          });
        });
      });

      describe('digital twin', () => {
        it('no record', () => {
          const upsert = IngestRecord.upsert('record-id');
          const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;
          upsertRequest.record = undefined;

          expect(
            upsert.node
              .digitalTwin({
                externalId: 'person-id',
                type: 'Owner',
                tenantId: 'tenant-id',
              })
              .marshal(),
          ).toEqual({
            record: undefined,
          });
        });

        it('no operation', () => {
          const upsert = IngestRecord.upsert('record-id');
          const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;

          if (!upsertRequest.record) {
            throw new Error('Record must be defined');
          }
          upsertRequest.record.operation = { oneofKind: undefined };

          expect(
            upsert.node
              .resource({
                externalId: 'lot-1',
                type: 'ParkingLot',
              })
              .marshal(),
          ).toEqual({
            record: {
              id: 'record-id',
              operation: {
                oneofKind: undefined,
              },
            },
          });
        });

        it('with operation', () => {
          const upsert = IngestRecord.upsert('record-id');

          expect(
            upsert.node
              .digitalTwin({
                externalId: 'person-id',
                type: 'Owner',
                tenantId: 'tenant-id',
              })
              .marshal(),
          ).toEqual({
            record: {
              id: 'record-id',
              operation: {
                oneofKind: 'upsert',
                upsert: {
                  data: {
                    oneofKind: 'node',
                    node: {
                      type: {
                        oneofKind: 'digitalTwin',
                        digitalTwin: {
                          externalId: 'person-id',
                          type: 'Owner',
                          tenantId: 'tenant-id',
                          tags: [],
                          properties: [],
                          identityProperties: [],
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          expect(
            upsert.node
              .digitalTwin({
                externalId: 'person-id',
                type: 'Owner',
                tags: ['MyTag'],
                properties: {
                  propertyKey: 'property-value',
                },
                tenantId: 'tenant-id',
                identityProperties: {
                  identityProperty: 'some-value',
                },
              })
              .marshal(),
          ).toEqual({
            record: {
              id: 'record-id',
              operation: {
                oneofKind: 'upsert',
                upsert: {
                  data: {
                    oneofKind: 'node',
                    node: {
                      type: {
                        oneofKind: 'digitalTwin',
                        digitalTwin: {
                          externalId: 'person-id',
                          type: 'Owner',
                          tenantId: 'tenant-id',
                          tags: ['MyTag'],
                          properties: [
                            {
                              key: 'propertyKey',
                              value: {
                                value: {
                                  oneofKind: 'stringValue',
                                  stringValue: 'property-value',
                                },
                              },
                            },
                          ],
                          identityProperties: [
                            {
                              key: 'identityProperty',
                              value: {
                                value: {
                                  oneofKind: 'stringValue',
                                  stringValue: 'some-value',
                                },
                              },
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          });
        });
      });
    });
  });

  describe('delete', () => {
    it('no more details', () => {
      expect(IngestRecord.delete('record-id').marshal()).toEqual({
        record: {
          id: 'record-id',
          operation: {
            oneofKind: 'delete',
            delete: {
              data: {
                oneofKind: undefined,
              },
            },
          },
        },
      });
    });

    describe('node', () => {
      it('no record', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;
        deleteRequest.record = undefined;

        expect(
          deleteRecord
            .node({
              externalId: 'lot-1',
              type: 'ParkingLot',
            })
            .marshal(),
        ).toEqual({
          record: undefined,
        });
      });

      it('no operation', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;

        if (!deleteRequest.record) {
          throw new Error('Record must be defined');
        }
        deleteRequest.record.operation = { oneofKind: undefined };

        expect(
          deleteRecord
            .node({
              externalId: 'lot-1',
              type: 'ParkingLot',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: undefined,
            },
          },
        });
      });

      it('with operation', () => {
        expect(
          IngestRecord.delete('record-id')
            .node({
              externalId: 'lot-1',
              type: 'ParkingLot',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'delete',
              delete: {
                data: {
                  oneofKind: 'node',
                  node: {
                    externalId: 'lot-1',
                    type: 'ParkingLot',
                  },
                },
              },
            },
          },
        });
      });
    });

    describe('nodeProperty', () => {
      it('no record', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;
        deleteRequest.record = undefined;

        expect(
          deleteRecord
            .nodeProperty(
              {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              'propertyKey',
            )
            .marshal(),
        ).toEqual({
          record: undefined,
        });
      });

      it('no operation', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;

        if (!deleteRequest.record) {
          throw new Error('Record must be defined');
        }
        deleteRequest.record.operation = { oneofKind: undefined };

        expect(
          deleteRecord
            .nodeProperty(
              {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              'propertyKey',
            )
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: undefined,
            },
          },
        });
      });

      it('with operation', () => {
        expect(
          IngestRecord.delete('record-id')
            .nodeProperty(
              {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              'propertyKey',
            )
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'delete',
              delete: {
                data: {
                  oneofKind: 'nodeProperty',
                  nodeProperty: {
                    key: 'propertyKey',
                    match: {
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                    },
                  },
                },
              },
            },
          },
        });
      });
    });

    describe('relation', () => {
      it('no record', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;
        deleteRequest.record = undefined;

        expect(
          deleteRecord
            .relation({
              sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
              targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CanUse',
            })
            .marshal(),
        ).toEqual({
          record: undefined,
        });
      });

      it('no operation', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;

        if (!deleteRequest.record) {
          throw new Error('Record must be defined');
        }
        deleteRequest.record.operation = { oneofKind: undefined };

        expect(
          deleteRecord
            .relation({
              sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
              targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CanUse',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: undefined,
            },
          },
        });
      });

      it('with operation', () => {
        expect(
          IngestRecord.delete('record-id')
            .relation({
              sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
              targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CanUse',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'delete',
              delete: {
                data: {
                  oneofKind: 'relation',
                  relation: {
                    sourceMatch: {
                      externalId: 'vehicle-1',
                      type: 'Vehicle',
                    },
                    targetMatch: {
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                    },
                    type: 'CanUse',
                  },
                },
              },
            },
          },
        });
      });
    });

    describe('relationProperty', () => {
      it('no record', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;
        deleteRequest.record = undefined;

        expect(
          deleteRecord
            .relationProperty(
              {
                sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
                targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
                type: 'CanUse',
              },
              'relationPropertyKey',
            )
            .marshal(),
        ).toEqual({
          record: undefined,
        });
      });

      it('no operation', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;

        if (!deleteRequest.record) {
          throw new Error('Record must be defined');
        }
        deleteRequest.record.operation = { oneofKind: undefined };

        expect(
          deleteRecord
            .relationProperty(
              {
                sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
                targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
                type: 'CanUse',
              },
              'relationPropertyKey',
            )
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: undefined,
            },
          },
        });
      });

      it('with operation', () => {
        expect(
          IngestRecord.delete('record-id')
            .relationProperty(
              {
                sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
                targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
                type: 'CanUse',
              },
              'relationPropertyKey',
            )
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'delete',
              delete: {
                data: {
                  oneofKind: 'relationProperty',
                  relationProperty: {
                    key: 'relationPropertyKey',
                    match: {
                      sourceMatch: {
                        externalId: 'vehicle-1',
                        type: 'Vehicle',
                      },
                      targetMatch: {
                        externalId: 'lot-1',
                        type: 'ParkingLot',
                      },
                      type: 'CanUse',
                    },
                  },
                },
              },
            },
          },
        });
      });
    });
  });
});
