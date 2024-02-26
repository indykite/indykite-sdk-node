import { EventEmitter } from 'events';
import { SdkClient } from '../../client/client';
import { IngestClient, IngestRecord } from '../../ingest';
import { applicationTokenMock } from '../../utils/test_utils';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import {
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsResponse,
} from '../../../grpc/indykite/ingest/v1beta3/ingest_api';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { streamKeeper } from '../../utils/stream';
import { Stream } from 'stream';

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
                  value: {
                    type: {
                      oneofKind: 'stringValue',
                      stringValue: 'propertyValue',
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
                  value: {
                    type: {
                      oneofKind: 'stringValue',
                      stringValue: 'propertyValue',
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
                    value: {
                      type: {
                        oneofKind: 'stringValue',
                        stringValue: 'property-value',
                      },
                    },
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
                    value: {
                      type: {
                        oneofKind: 'stringValue',
                        stringValue: 'property-value',
                      },
                    },
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
