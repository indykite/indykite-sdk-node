import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { Stream } from 'stream';

import { EventEmitter } from 'events';
import { SdkClient } from '../../client/client';
import {
  IngestClient,
  IngestRecord,
  IngestNodeRecord,
  IngestNodeMatch,
  IngestNodePropertyMatch,
  IngestRelationship,
  IngestRelationshipProperty,
} from '../../ingest';
import { applicationTokenMock } from '../../utils/test_utils';
import {
  BatchUpsertNodesResponse,
  BatchDeleteNodesResponse,
  BatchDeleteNodePropertiesResponse,
  BatchUpsertRelationshipsResponse,
  BatchDeleteRelationshipsResponse,
  BatchDeleteRelationshipPropertiesResponse,
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsResponse,
} from '../../../grpc/indykite/ingest/v1beta3/ingest_api';
import { Utils } from '../../utils/utils';
import { streamKeeper } from '../../utils/stream';

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
  let record: IngestRecord;
  let response: IngestRecordResponse | undefined;

  beforeEach(() => {
    record = IngestRecord.upsert('record-id').node({
      externalId: 'lot-1',
      type: 'ParkingLot',
    });
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
                recordId: 'record-id',
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.ingestRecord(record);
    });

    it('sends correct request', () => {
      expect(ingestRecordSpy).toHaveBeenCalledWith(
        {
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'upsert',
              upsert: {
                data: {
                  oneofKind: 'node',
                  node: {
                    externalId: 'lot-1',
                    type: 'ParkingLot',
                    tags: [],
                    properties: [],
                    id: '',
                    isIdentity: false,
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
  let mockedWrite: jest.SpyInstance;
  let returnedValue: ClientMock;
  let returnedData: unknown[] = [];

  beforeEach(async () => {
    returnedData = [];
    const [input, output] = streamKeeper(null as unknown as Parameters<typeof streamKeeper>[0]);
    input.write = jest.fn();
    input.end = jest.fn().mockImplementation(() => {
      output.emit('data', {
        error: {
          oneofKind: undefined,
        },
        recordId: 'lot-1',
      } as IngestRecordResponse);
      output.emit('data', {
        error: {
          oneofKind: undefined,
        },
        recordId: 'lot-2',
      } as IngestRecordResponse);
      output.emit('end');
    });
    mockedWrite = input.write as jest.Mock;

    const stream = new Stream.Readable({
      objectMode: true,
      read: jest.fn(),
    });
    stream.push(
      IngestRecord.upsert('record-1').node({
        externalId: 'lot-1',
        type: 'ParkingLot',
      }),
    );
    stream.push(
      IngestRecord.upsert('record-2').node({
        externalId: 'lot-2',
        type: 'ParkingLot',
      }),
    );
    stream.push(null);

    returnedValue = sdk.streamRecords(stream) as unknown as ClientMock;
    returnedValue.on('data', (data) => {
      returnedData.push(data);
    });

    return new Promise<void>((resolve) => {
      returnedValue.on('end', () => {
        returnedValue.removeAllListeners();
        resolve();
      });
    });
  });

  it('sends a correct request', () => {
    expect(mockedWrite).toHaveBeenCalledTimes(2);
    expect(mockedWrite).toHaveBeenNthCalledWith(1, {
      record: {
        id: 'record-1',
        operation: {
          oneofKind: 'upsert',
          upsert: {
            data: {
              oneofKind: 'node',
              node: {
                externalId: 'lot-1',
                type: 'ParkingLot',
                tags: [],
                properties: [],
                id: '',
                isIdentity: false,
              },
            },
          },
        },
      },
    });
    expect(mockedWrite).toHaveBeenNthCalledWith(2, {
      record: {
        id: 'record-2',
        operation: {
          oneofKind: 'upsert',
          upsert: {
            data: {
              oneofKind: 'node',
              node: {
                externalId: 'lot-2',
                type: 'ParkingLot',
                tags: [],
                properties: [],
                id: '',
                isIdentity: false,
              },
            },
          },
        },
      },
    });
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

describe('streamRecordsArray', () => {
  let returnedData: StreamRecordsResponse[] = [];
  let streamRecordsSpy: jest.SpyInstance;

  beforeEach(async () => {
    streamRecordsSpy = jest.spyOn(sdk, 'streamRecordsArray').mockImplementation(() => {
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

    returnedData = await sdk.streamRecordsArray([
      IngestRecord.upsert('record-1')
        .node({
          externalId: 'lot-1',
          type: 'ParkingLot',
        })
        .getRecord(),
      IngestRecord.upsert('record-2')
        .node({
          externalId: 'lot-2',
          type: 'ParkingLot',
        })
        .getRecord(),
    ]);
  });

  it('sends a correct request', () => {
    expect(streamRecordsSpy).toHaveBeenCalledTimes(1);
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

    describe('relationship', () => {
      it('no record', () => {
        const upsert = IngestRecord.upsert('record-id');
        const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;
        upsertRequest.record = undefined;

        expect(
          upsert
            .relationship({
              source: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              target: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CAN_USE',
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
            .relationship({
              source: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              target: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CAN_USE',
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
        const datetmp = Utils.dateToTimestamp(new Date());

        expect(
          upsert
            .relationship({
              source: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              target: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CAN_USE',
              properties: [
                {
                  type: 'propertyType',
                  value: 'propertyValue',
                  metadata: {
                    assuranceLevel: 1,
                    verificationTime: datetmp,
                    source: 'Myself',
                    customMetadata: {
                      customdata: 'SomeCustomData',
                    },
                  },
                },
              ],
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'upsert',
              upsert: {
                data: {
                  oneofKind: 'relationship',
                  relationship: {
                    source: {
                      externalId: 'vehicle-1',
                      type: 'Vehicle',
                    },
                    target: {
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                    },
                    type: 'CAN_USE',
                    properties: [
                      {
                        type: 'propertyType',
                        value: {
                          type: {
                            oneofKind: 'stringValue',
                            stringValue: 'propertyValue',
                          },
                        },
                        metadata: {
                          assuranceLevel: 1,
                          verificationTime: datetmp,
                          source: 'Myself',
                          customMetadata: {
                            customdata: {
                              type: {
                                oneofKind: 'stringValue',
                                stringValue: 'SomeCustomData',
                              },
                            },
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

        expect(
          upsert
            .relationship({
              source: {
                externalId: 'vehicle-1',
                type: 'Vehicle',
              },
              target: {
                externalId: 'lot-1',
                type: 'ParkingLot',
              },
              type: 'CAN_USE',
              properties: [
                {
                  type: 'propertyType',
                  value: 'propertyValue',
                },
              ],
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'upsert',
              upsert: {
                data: {
                  oneofKind: 'relationship',
                  relationship: {
                    source: {
                      externalId: 'vehicle-1',
                      type: 'Vehicle',
                    },
                    target: {
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                    },
                    type: 'CAN_USE',
                    properties: [
                      {
                        type: 'propertyType',
                        value: {
                          type: {
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
            upsert
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
          const upsert = IngestRecord.upsert('record-id');
          const upsertRequest = (upsert as unknown as { request: IngestRecordRequest }).request;

          if (!upsertRequest.record) {
            throw new Error('Record must be defined');
          }
          upsertRequest.record.operation = { oneofKind: undefined };

          expect(
            upsert
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
          const upsert = IngestRecord.upsert('record-id');

          expect(
            upsert
              .node({
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
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                      tags: [],
                      properties: [],
                      id: '',
                      isIdentity: false,
                    },
                  },
                },
              },
            },
          });

          expect(
            upsert
              .node({
                externalId: 'lot-1',
                type: 'ParkingLot',
                tags: ['MyTag'],
                properties: [
                  {
                    type: 'propertyType',
                    value: 'property-value',
                  },
                ],
                id: '',
                isIdentity: false,
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
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                      tags: ['MyTag'],
                      properties: [
                        {
                          type: 'propertyType',
                          value: {
                            type: {
                              oneofKind: 'stringValue',
                              stringValue: 'property-value',
                            },
                          },
                          metadata: undefined,
                        },
                      ],
                      id: '',
                      isIdentity: false,
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
            upsert
              .node({
                id: '',
                externalId: 'person-id',
                type: 'Owner',
                isIdentity: true,
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
          const upsert = IngestRecord.upsert('record-id');

          expect(
            upsert
              .node({
                id: '',
                externalId: 'person-id',
                type: 'Owner',
                isIdentity: true,
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
                      externalId: 'person-id',
                      id: '',
                      properties: [],
                      tags: [],
                      type: 'Owner',
                      isIdentity: true,
                    },
                  },
                },
              },
            },
          });

          expect(
            upsert
              .node({
                id: '',
                externalId: 'person-id',
                type: 'Owner',
                tags: ['MyTag'],
                properties: [
                  {
                    type: 'propertyType',
                    value: 'property-value',
                  },
                ],
                isIdentity: true,
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
                      id: '',
                      externalId: 'person-id',
                      type: 'Owner',
                      tags: ['MyTag'],
                      properties: [
                        {
                          type: 'propertyType',
                          value: {
                            type: {
                              oneofKind: 'stringValue',
                              stringValue: 'property-value',
                            },
                          },
                          metadata: undefined,
                        },
                      ],
                      isIdentity: true,
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
              'propertyType',
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
              'propertyType',
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
              'propertyType',
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
                    propertyType: 'propertyType',
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

    describe('relationship', () => {
      it('no record', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;
        deleteRequest.record = undefined;

        expect(
          deleteRecord
            .relationship({
              source: { externalId: 'vehicle-1', type: 'Vehicle' },
              target: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CAN_USE',
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
            .relationship({
              source: { externalId: 'vehicle-1', type: 'Vehicle' },
              target: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CAN_USE',
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
            .relationship({
              source: { externalId: 'vehicle-1', type: 'Vehicle' },
              target: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CAN_USE',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'delete',
              delete: {
                data: {
                  oneofKind: 'relationship',
                  relationship: {
                    source: {
                      externalId: 'vehicle-1',
                      type: 'Vehicle',
                    },
                    target: {
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                    },
                    type: 'CAN_USE',
                    properties: [],
                  },
                },
              },
            },
          },
        });
      });
    });

    describe('relationshipProperty', () => {
      it('no record', () => {
        const deleteRecord = IngestRecord.delete('record-id');
        const deleteRequest = (deleteRecord as unknown as { request: IngestRecordRequest }).request;
        deleteRequest.record = undefined;

        expect(
          deleteRecord
            .relationshipProperty({
              source: { externalId: 'vehicle-1', type: 'Vehicle' },
              target: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CAN_USE',
              propertyType: 'relationshipPropertyType',
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
            .relationshipProperty({
              source: { externalId: 'vehicle-1', type: 'Vehicle' },
              target: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CAN_USE',
              propertyType: 'relationshipPropertyType',
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
            .relationshipProperty({
              source: { externalId: 'vehicle-1', type: 'Vehicle' },
              target: { externalId: 'lot-1', type: 'ParkingLot' },
              type: 'CAN_USE',
              propertyType: 'relationshipPropertyType',
            })
            .marshal(),
        ).toEqual({
          record: {
            id: 'record-id',
            operation: {
              oneofKind: 'delete',
              delete: {
                data: {
                  oneofKind: 'relationshipProperty',
                  relationshipProperty: {
                    source: {
                      externalId: 'vehicle-1',
                      type: 'Vehicle',
                    },
                    target: {
                      externalId: 'lot-1',
                      type: 'ParkingLot',
                    },
                    type: 'CAN_USE',
                    propertyType: 'relationshipPropertyType',
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

describe('batchUpsertNodes', () => {
  let response: BatchUpsertNodesResponse | undefined;
  let nodes: IngestNodeRecord[];

  beforeEach(() => {
    nodes = [
      {
        externalId: 'person3',
        type: 'Person',
        properties: [
          {
            type: 'customProp',
            value: '42',
            metadata: {
              assuranceLevel: 1,
              verificationTime: Utils.dateToTimestamp(new Date()),
              source: 'Myself',
              customMetadata: {
                customdata: 'SomeCustomData',
              },
            },
          },
        ],
        id: '',
        isIdentity: false,
        tags: [],
      },
      {
        externalId: 'person4',
        type: 'Person',
        properties: [
          {
            type: 'email',
            value: 'person4@yahoo.com',
          },
        ],
        id: '',
        isIdentity: false,
        tags: [],
      },
    ];
    response = undefined;
  });

  describe('when no error is returned', () => {
    let batchUpsertSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      batchUpsertSpy = jest
        .spyOn(sdk['client'], 'batchUpsertNodes')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: BatchUpsertNodesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                results: [
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHHAJnz-XBUfCo-nxapTwF_o',
                        dataType: 1,
                      },
                    ],
                  },
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHMYjzqeCzk8SpXF9wVs6iBc',
                        dataType: 1,
                      },
                    ],
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.batchUpsertNodes(nodes);
    });

    it('batch sends correct request', () => {
      expect(batchUpsertSpy).toHaveBeenCalledWith(
        {
          nodes: [
            {
              externalId: 'person3',
              properties: [],
              type: 'Person',
              id: '',
              isIdentity: false,
              tags: [],
            },
            {
              externalId: 'person4',
              properties: [],
              type: 'Person',
              id: '',
              isIdentity: false,
              tags: [],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('batch returns a correct response', () => {
      expect(response?.results[0]).not.toBeNull;
    });
  });

  describe('when the batch response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'batchUpsertNodes')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchUpsertNodesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchUpsertNodes(nodes).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('batch when an error is returned', () => {
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
        .spyOn(sdk['client'], 'batchUpsertNodes')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchUpsertNodesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchUpsertNodes(nodes).catch((err) => {
        thrownError = err;
      });
    });

    it('batch throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('batchDeleteNodes', () => {
  let response: BatchDeleteNodesResponse | undefined;
  let nodes: IngestNodeMatch[];

  beforeEach(() => {
    nodes = [
      {
        externalId: 'person1',
        type: 'Person',
      },
      {
        externalId: 'person2',
        type: 'Person',
      },
    ];
    response = undefined;
  });

  describe('when no error is returned in batch delete', () => {
    let batchDeleteSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      batchDeleteSpy = jest
        .spyOn(sdk['client'], 'batchDeleteNodes')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: BatchDeleteNodesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                results: [
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHHAJnz-XBUfCo-nxapTwF_o',
                        dataType: 1,
                      },
                    ],
                  },
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHMYjzqeCzk8SpXF9wVs6iBc',
                        dataType: 1,
                      },
                    ],
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.batchDeleteNodes(nodes);
    });

    it('batch sends correct request', () => {
      expect(batchDeleteSpy).toHaveBeenCalledWith(
        {
          nodes: [
            {
              externalId: 'person1',
              type: 'Person',
            },
            {
              externalId: 'person2',
              type: 'Person',
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('batch returns a correct response', () => {
      expect(response?.results[0]).not.toBeNull;
    });
  });

  describe('when the batch delete response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'batchDeleteNodes')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchDeleteNodesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteNodes(nodes).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('batch delete when an error is returned', () => {
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
        .spyOn(sdk['client'], 'batchDeleteNodes')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchDeleteNodesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteNodes(nodes).catch((err) => {
        thrownError = err;
      });
    });

    it('batch throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('batchDeleteNodeProperties', () => {
  let response: BatchDeleteNodePropertiesResponse | undefined;
  let nodeProperties: IngestNodePropertyMatch[];

  beforeEach(() => {
    nodeProperties = [
      {
        match: {
          externalId: 'person1',
          type: 'Person',
        },
        propertyType: 'customProp',
      },
      {
        match: {
          externalId: 'person1',
          type: 'Person',
        },
        propertyType: 'customProp2',
      },
    ];
    response = undefined;
  });

  describe('when no error is returned in batch delete properties', () => {
    let batchDeleteNodePropertiesSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      batchDeleteNodePropertiesSpy = jest
        .spyOn(sdk['client'], 'batchDeleteNodeProperties')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: BatchDeleteNodePropertiesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                results: [
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHHAJnz-XBUfCo-nxapTwF_o',
                        dataType: 1,
                      },
                    ],
                  },
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHMYjzqeCzk8SpXF9wVs6iBc',
                        dataType: 1,
                      },
                    ],
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.batchDeleteNodeProperties(nodeProperties);
    });

    it('batch sends correct request', () => {
      expect(batchDeleteNodePropertiesSpy).toHaveBeenCalledWith(
        {
          nodeProperties: [
            {
              match: {
                externalId: 'person1',
                type: 'Person',
              },
              propertyType: 'customProp',
            },
            {
              match: {
                externalId: 'person1',
                type: 'Person',
              },
              propertyType: 'customProp2',
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('batch returns a correct response', () => {
      expect(response?.results[0]).not.toBeNull;
    });
  });

  describe('when the batch delete node properties response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'batchDeleteNodeProperties')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchDeleteNodePropertiesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteNodeProperties(nodeProperties).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('batch delete properties when an error is returned', () => {
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
        .spyOn(sdk['client'], 'batchDeleteNodeProperties')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchDeleteNodePropertiesResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteNodeProperties(nodeProperties).catch((err) => {
        thrownError = err;
      });
    });

    it('batch throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('batchUpsertRelationships', () => {
  let response: BatchUpsertRelationshipsResponse | undefined;
  let relationships: IngestRelationship[];
  const timeNow = Utils.dateToTimestamp(new Date());

  beforeEach(() => {
    relationships = [
      {
        source: { externalId: 'person3', type: 'Person' },
        target: { externalId: 'car3', type: 'Car' },
        type: 'OWNS',
        properties: [
          {
            type: 'customProp',
            value: '46',
            metadata: {
              assuranceLevel: 1,
              verificationTime: timeNow,
              source: 'Myself',
              customMetadata: {
                customdata: 'SomeCustomData',
              },
            },
          },
        ],
      },
      {
        source: { externalId: 'person4', type: 'Person' },
        target: { externalId: 'car4', type: 'Car' },
        type: 'OWNS',
        properties: [
          {
            type: 'licence',
            value: '4712589',
          },
        ],
      },
    ];
    response = undefined;
  });

  describe('when no error is returned', () => {
    let batchUpsertSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      batchUpsertSpy = jest
        .spyOn(sdk['client'], 'batchUpsertRelationships')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: BatchUpsertRelationshipsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                results: [
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHHAJnz-XBUfCo-nxapTwF_o',
                        dataType: 1,
                      },
                    ],
                  },
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHMYjzqeCzk8SpXF9wVs6iBc',
                        dataType: 1,
                      },
                    ],
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.batchUpsertRelationships(relationships);
    });

    it('batch sends correct request', () => {
      expect(batchUpsertSpy).toHaveBeenCalledWith(
        {
          relationships: [
            {
              source: { externalId: 'person3', type: 'Person' },
              target: { externalId: 'car3', type: 'Car' },
              type: 'OWNS',
              properties: [
                {
                  type: 'customProp',
                  value: {
                    type: {
                      oneofKind: 'stringValue',
                      stringValue: '46',
                    },
                  },
                  metadata: {
                    assuranceLevel: 1,
                    verificationTime: timeNow,
                    source: 'Myself',
                    customMetadata: {
                      customdata: {
                        type: {
                          oneofKind: 'stringValue',
                          stringValue: 'SomeCustomData',
                        },
                      },
                    },
                  },
                },
              ],
            },
            {
              source: { externalId: 'person4', type: 'Person' },
              target: { externalId: 'car4', type: 'Car' },
              type: 'OWNS',
              properties: [
                {
                  type: 'licence',
                  value: {
                    type: {
                      oneofKind: 'stringValue',
                      stringValue: '4712589',
                    },
                  },
                  metadata: undefined,
                },
              ],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('batch returns a correct response', () => {
      expect(response?.results[0]).not.toBeNull;
    });
  });

  describe('when the batch response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'batchUpsertRelationships')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchUpsertRelationshipsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchUpsertRelationships(relationships).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('batch when an error is returned', () => {
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
        .spyOn(sdk['client'], 'batchUpsertRelationships')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchUpsertRelationshipsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchUpsertRelationships(relationships).catch((err) => {
        thrownError = err;
      });
    });

    it('batch throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('batchDeleteRelationships', () => {
  let response: BatchDeleteRelationshipsResponse | undefined;
  let relationships: IngestRelationship[];
  const timeNow = Utils.dateToTimestamp(new Date());

  beforeEach(() => {
    relationships = [
      {
        source: { externalId: 'person3', type: 'Person' },
        target: { externalId: 'car3', type: 'Car' },
        type: 'OWNS',
        properties: [
          {
            type: 'customProp',
            value: '46',
            metadata: {
              assuranceLevel: 1,
              verificationTime: timeNow,
              source: 'Myself',
              customMetadata: {
                customdata: 'SomeCustomData',
              },
            },
          },
        ],
      },
      {
        source: { externalId: 'person4', type: 'Person' },
        target: { externalId: 'car4', type: 'Car' },
        type: 'OWNS',
        properties: [
          {
            type: 'licence',
            value: '4712589',
          },
        ],
      },
    ];
    response = undefined;
  });

  describe('when no error is returned in batch delete', () => {
    let batchDeleteSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      batchDeleteSpy = jest
        .spyOn(sdk['client'], 'batchDeleteRelationships')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: BatchDeleteRelationshipsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                results: [
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHHAJnz-XBUfCo-nxapTwF_o',
                        dataType: 1,
                      },
                    ],
                  },
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHMYjzqeCzk8SpXF9wVs6iBc',
                        dataType: 1,
                      },
                    ],
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.batchDeleteRelationships(relationships);
    });

    it('batch sends correct request', () => {
      expect(batchDeleteSpy).toHaveBeenCalledWith(
        {
          relationships: [
            {
              source: { externalId: 'person3', type: 'Person' },
              target: { externalId: 'car3', type: 'Car' },
              type: 'OWNS',
              properties: [
                {
                  type: 'customProp',
                  value: {
                    type: {
                      oneofKind: 'stringValue',
                      stringValue: '46',
                    },
                  },
                  metadata: {
                    assuranceLevel: 1,
                    verificationTime: timeNow,
                    source: 'Myself',
                    customMetadata: {
                      customdata: {
                        type: {
                          oneofKind: 'stringValue',
                          stringValue: 'SomeCustomData',
                        },
                      },
                    },
                  },
                },
              ],
            },
            {
              source: { externalId: 'person4', type: 'Person' },
              target: { externalId: 'car4', type: 'Car' },
              type: 'OWNS',
              properties: [
                {
                  type: 'licence',
                  value: {
                    type: {
                      oneofKind: 'stringValue',
                      stringValue: '4712589',
                    },
                  },
                  metadata: undefined,
                },
              ],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('batch returns a correct response', () => {
      expect(response?.results[0]).not.toBeNull;
    });
  });

  describe('when the batch delete response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'batchDeleteRelationships')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchDeleteRelationshipsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteRelationships(relationships).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('batch delete when an error is returned', () => {
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
        .spyOn(sdk['client'], 'batchDeleteRelationships')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: BatchDeleteRelationshipsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteRelationships(relationships).catch((err) => {
        thrownError = err;
      });
    });

    it('batch throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('batchDeleteRelationshipProperties', () => {
  let response: BatchDeleteRelationshipPropertiesResponse | undefined;
  let relationshipProperties: IngestRelationshipProperty[];

  beforeEach(() => {
    relationshipProperties = [
      {
        source: { externalId: 'person3', type: 'Person' },
        target: { externalId: 'car3', type: 'Car' },
        type: 'OWNS',
        propertyType: 'custom3',
      },
      {
        source: { externalId: 'person4', type: 'Person' },
        target: { externalId: 'car4', type: 'Car' },
        type: 'OWNS',
        propertyType: 'custom4',
      },
    ];
    response = undefined;
  });

  describe('when no error is returned in batch delete properties', () => {
    let batchDeleteRelationshipPropertiesSpy: jest.SpyInstance;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      batchDeleteRelationshipPropertiesSpy = jest
        .spyOn(sdk['client'], 'batchDeleteRelationshipProperties')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: BatchDeleteRelationshipPropertiesResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                results: [
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHHAJnz-XBUfCo-nxapTwF_o',
                        dataType: 1,
                      },
                    ],
                  },
                  {
                    changes: [
                      {
                        id: 'gid:AAAAHMYjzqeCzk8SpXF9wVs6iBc',
                        dataType: 1,
                      },
                    ],
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );

      response = await sdk.batchDeleteRelationshipProperties(relationshipProperties);
    });

    it('batch sends correct request', () => {
      expect(batchDeleteRelationshipPropertiesSpy).toHaveBeenCalledWith(
        {
          relationshipProperties: [
            {
              source: { externalId: 'person3', type: 'Person' },
              target: { externalId: 'car3', type: 'Car' },
              type: 'OWNS',
              propertyType: 'custom3',
            },
            {
              source: { externalId: 'person4', type: 'Person' },
              target: { externalId: 'car4', type: 'Car' },
              type: 'OWNS',
              propertyType: 'custom4',
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('batch returns a correct response', () => {
      expect(response?.results[0]).not.toBeNull;
    });
  });

  describe('when the batch delete node properties response is empty', () => {
    let thrownError: Error;
    let sdk: IngestClient;

    beforeEach(async () => {
      sdk = await IngestClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'batchDeleteRelationshipProperties')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: BatchDeleteRelationshipPropertiesResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteRelationshipProperties(relationshipProperties).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No IngestClient record response');
    });
  });

  describe('batch delete properties when an error is returned', () => {
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
        .spyOn(sdk['client'], 'batchDeleteRelationshipProperties')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: BatchDeleteRelationshipPropertiesResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      return sdk.batchDeleteRelationshipProperties(relationshipProperties).catch((err) => {
        thrownError = err;
      });
    });

    it('batch throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
