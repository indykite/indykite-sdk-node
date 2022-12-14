import { IngestResults } from './../../model/ingest/ingest_response';
import { EventEmitter } from 'events';
import { Stream } from 'stream';
import { StreamRecordsResponse } from '../../../grpc/indykite/ingest/v1beta1/ingest_api';
import { SdkClient } from '../../client/client';
import { IngestClient } from '../../ingest';
import { Any } from '../../../grpc/google/protobuf/any';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';

let sdk: IngestClient;

class ClientMock extends EventEmitter {
  end() {
    throw new Error('Not implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  write(_: { record: { id: string } }) {
    throw new Error('Not implemented');
  }
}

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

describe('when recordId is not used', () => {
  let mockedClient: ClientMock;
  let mockedWrite: jest.SpyInstance;
  let returnedValue: IngestResults;

  beforeEach(() => {
    let indexCounter = 0;
    mockedClient = new ClientMock();
    mockedWrite = jest
      .spyOn(mockedClient, 'write')
      .mockImplementation((obj: { record: { id: string } }) => {
        mockedClient.emit('data', {
          recordId: obj.record.id,
          recordIndex: indexCounter++,
          error: {},
        } as StreamRecordsResponse);
      });
    jest.spyOn(mockedClient, 'end').mockImplementation(() => {
      indexCounter = 0;
      mockedClient.emit('end');
    });

    const mockFunc = jest.fn().mockImplementation(() => mockedClient);
    jest.spyOn(sdk['client'], 'streamRecords').mockImplementation(mockFunc);
  });

  describe('when an empty list of objects is sent', () => {
    beforeEach(async () => {
      returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', []);
    });

    it('sends a correct request', () => {
      expect(mockedWrite).toBeCalledTimes(0);
    });

    it('returns correct response', () => {
      expect(returnedValue.hasError).toBe(false);
      expect(returnedValue.errorResults.length).toBe(0);
      expect(returnedValue.results.length).toBe(0);
    });
  });

  describe('when one object is sent', () => {
    beforeEach(async () => {
      returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', [
        {
          fodselsnr: 15120599558,
          slektsnavn: 'FAMILIE',
          fornavn: 'ULF',
          familienummer: 15125049580,
          mors_fodselsnr: 15125149682,
          fars_fodselsnr: 15125049580,
        },
      ]);
    });

    it('sends a correct request', () => {
      expect(mockedWrite).toBeCalledTimes(1);
      expect(mockedWrite).toBeCalledWith({
        mappingConfigId: 'mapping-id',
        record: {
          data: {
            fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15120599558 } },
            slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
            fornavn: { value: { oneofKind: 'stringValue', stringValue: 'ULF' } },
            familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            mors_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125149682 } },
            fars_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
          },
          externalId: 'fodselsnr',
          id: '15120599558',
        },
      });
    });

    it('returns correct response', () => {
      expect(returnedValue.hasError).toBe(false);
      expect(returnedValue.errorResults.length).toBe(0);
      expect(returnedValue.results.length).toBe(1);
      expect(returnedValue.results[0].id).toBe('15120599558');
      expect(returnedValue.results[0].index).toBe(0);
      expect(returnedValue.results[0].isError()).toBe(false);
      expect(returnedValue.results[0].isSuccess()).toBe(true);
    });
  });

  describe('when two objects are sent', () => {
    beforeEach(async () => {
      returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', [
        {
          fodselsnr: 15120599558,
          slektsnavn: 'FAMILIE',
          fornavn: 'ULF',
          familienummer: 15125049580,
          mors_fodselsnr: 15125149682,
          fars_fodselsnr: 15125049580,
        },
        {
          fodselsnr: 15125049580,
          slektsnavn: 'FAMILIE',
          fornavn: 'OLE',
          familienummer: 15125049580,
        },
      ]);
    });

    it('sends a correct request', () => {
      expect(mockedWrite).toBeCalledTimes(2);
      expect(mockedWrite).nthCalledWith(1, {
        mappingConfigId: 'mapping-id',
        record: {
          data: {
            fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15120599558 } },
            slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
            fornavn: { value: { oneofKind: 'stringValue', stringValue: 'ULF' } },
            familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            mors_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125149682 } },
            fars_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
          },
          externalId: 'fodselsnr',
          id: '15120599558',
        },
      });
      expect(mockedWrite).nthCalledWith(2, {
        mappingConfigId: 'mapping-id',
        record: {
          data: {
            fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
            fornavn: { value: { oneofKind: 'stringValue', stringValue: 'OLE' } },
            familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
          },
          externalId: 'fodselsnr',
          id: '15125049580',
        },
      });
    });

    it('returns correct response', () => {
      expect(returnedValue.hasError).toBe(false);
      expect(returnedValue.errorResults.length).toBe(0);
      expect(returnedValue.results.length).toBe(2);
      expect(returnedValue.results[0].id).toBe('15120599558');
      expect(returnedValue.results[0].index).toBe(0);
      expect(returnedValue.results[0].isError()).toBe(false);
      expect(returnedValue.results[0].isSuccess()).toBe(true);
      expect(returnedValue.results[1].id).toBe('15125049580');
      expect(returnedValue.results[1].index).toBe(1);
      expect(returnedValue.results[1].isError()).toBe(false);
      expect(returnedValue.results[1].isSuccess()).toBe(true);
    });
  });
});

describe('when recordId is used', () => {
  const recordId = 'specialId';
  let mockedClient: ClientMock;
  let mockedWrite: jest.SpyInstance;
  let returnedValue: IngestResults;

  beforeEach(() => {
    let indexCounter = 0;
    mockedClient = new ClientMock();
    mockedWrite = jest
      .spyOn(mockedClient, 'write')
      .mockImplementation((obj: { record: { id: string } }) => {
        mockedClient.emit('data', {
          recordId: obj.record.id,
          recordIndex: indexCounter++,
          error: {},
        } as StreamRecordsResponse);
      });
    jest.spyOn(mockedClient, 'end').mockImplementation(() => {
      indexCounter = 0;
      mockedClient.emit('end');
    });

    const mockFunc = jest.fn().mockImplementation(() => mockedClient);
    jest.spyOn(sdk['client'], 'streamRecords').mockImplementation(mockFunc);
  });

  describe('when an empty list of objects is sent', () => {
    beforeEach(async () => {
      returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', [], recordId);
    });

    it('sends a correct request', () => {
      expect(mockedWrite).toBeCalledTimes(0);
    });

    it('returns correct response', () => {
      expect(returnedValue.hasError).toBe(false);
      expect(returnedValue.errorResults.length).toBe(0);
      expect(returnedValue.results.length).toBe(0);
    });
  });

  describe('when one object is sent', () => {
    beforeEach(async () => {
      returnedValue = await sdk.ingest(
        'mapping-id',
        'fodselsnr',
        [
          {
            fodselsnr: 15120599558,
            slektsnavn: 'FAMILIE',
            fornavn: 'ULF',
            familienummer: 15125049580,
            mors_fodselsnr: 15125149682,
            fars_fodselsnr: 15125049580,
            [recordId]: '1234',
          },
        ],
        recordId,
      );
    });

    it('sends a correct request', () => {
      expect(mockedWrite).toBeCalledTimes(1);
      expect(mockedWrite).toBeCalledWith({
        mappingConfigId: 'mapping-id',
        record: {
          data: {
            fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15120599558 } },
            slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
            fornavn: { value: { oneofKind: 'stringValue', stringValue: 'ULF' } },
            familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            mors_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125149682 } },
            fars_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            [recordId]: { value: { oneofKind: 'stringValue', stringValue: '1234' } },
          },
          externalId: 'fodselsnr',
          id: '1234',
        },
      });
    });

    it('returns correct response', () => {
      expect(returnedValue.hasError).toBe(false);
      expect(returnedValue.errorResults.length).toBe(0);
      expect(returnedValue.results.length).toBe(1);
      expect(returnedValue.results[0].id).toBe('1234');
      expect(returnedValue.results[0].index).toBe(0);
      expect(returnedValue.results[0].isError()).toBe(false);
      expect(returnedValue.results[0].isSuccess()).toBe(true);
    });
  });

  describe('when two objects are sent', () => {
    beforeEach(async () => {
      returnedValue = await sdk.ingest(
        'mapping-id',
        'fodselsnr',
        [
          {
            fodselsnr: 15120599558,
            slektsnavn: 'FAMILIE',
            fornavn: 'ULF',
            familienummer: 15125049580,
            mors_fodselsnr: 15125149682,
            fars_fodselsnr: 15125049580,
            [recordId]: '1234',
          },
          {
            fodselsnr: 15125049580,
            slektsnavn: 'FAMILIE',
            fornavn: 'OLE',
            familienummer: 15125049580,
          },
        ],
        recordId,
      );
    });

    it('sends a correct request', () => {
      expect(mockedWrite).toBeCalledTimes(2);
      expect(mockedWrite).nthCalledWith(1, {
        mappingConfigId: 'mapping-id',
        record: {
          data: {
            fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15120599558 } },
            slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
            fornavn: { value: { oneofKind: 'stringValue', stringValue: 'ULF' } },
            familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            mors_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125149682 } },
            fars_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            [recordId]: { value: { oneofKind: 'stringValue', stringValue: '1234' } },
          },
          externalId: 'fodselsnr',
          id: '1234',
        },
      });
      expect(mockedWrite).nthCalledWith(2, {
        mappingConfigId: 'mapping-id',
        record: {
          data: {
            fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
            slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
            fornavn: { value: { oneofKind: 'stringValue', stringValue: 'OLE' } },
            familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
          },
          externalId: 'fodselsnr',
          id: '15125049580',
        },
      });
    });

    it('returns correct response', () => {
      expect(returnedValue.hasError).toBe(false);
      expect(returnedValue.errorResults.length).toBe(0);
      expect(returnedValue.results.length).toBe(2);
      expect(returnedValue.results[0].id).toBe('1234');
      expect(returnedValue.results[0].index).toBe(0);
      expect(returnedValue.results[0].isError()).toBe(false);
      expect(returnedValue.results[0].isSuccess()).toBe(true);
      expect(returnedValue.results[1].id).toBe('15125049580');
      expect(returnedValue.results[1].index).toBe(1);
      expect(returnedValue.results[1].isError()).toBe(false);
      expect(returnedValue.results[1].isSuccess()).toBe(true);
    });
  });
});

describe('when a stream is used', () => {
  let mockedClient: ClientMock;
  let mockedWrite: jest.SpyInstance;
  let returnedValue: IngestResults;

  beforeEach(async () => {
    let indexCounter = 0;
    mockedClient = new ClientMock();
    mockedWrite = jest
      .spyOn(mockedClient, 'write')
      .mockImplementation((obj: { record: { id: string } }) => {
        mockedClient.emit('data', {
          recordId: obj.record.id,
          recordIndex: indexCounter++,
          error: {},
        } as StreamRecordsResponse);
      });
    jest.spyOn(mockedClient, 'end').mockImplementation(() => {
      indexCounter = 0;
      mockedClient.emit('end');
    });

    const mockFunc = jest.fn().mockImplementation(() => mockedClient);
    jest.spyOn(sdk['client'], 'streamRecords').mockImplementation(mockFunc);

    const stream = new Stream.Readable({
      objectMode: true,
      read: jest.fn(),
    });
    stream.push({
      fodselsnr: 15120599558,
      slektsnavn: 'FAMILIE',
      fornavn: 'ULF',
      familienummer: 15125049580,
      mors_fodselsnr: 15125149682,
      fars_fodselsnr: 15125049580,
    });
    stream.push(
      Buffer.from(
        JSON.stringify({
          fodselsnr: 15125049580,
          slektsnavn: 'FAMILIE',
          fornavn: 'OLE',
          familienummer: 15125049580,
        }),
      ),
    );
    stream.push(null);

    returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', stream);
  });

  it('sends a correct request', () => {
    expect(mockedWrite).toBeCalledTimes(2);
    expect(mockedWrite).nthCalledWith(1, {
      mappingConfigId: 'mapping-id',
      record: {
        data: {
          fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15120599558 } },
          slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
          fornavn: { value: { oneofKind: 'stringValue', stringValue: 'ULF' } },
          familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
          mors_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125149682 } },
          fars_fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
        },
        externalId: 'fodselsnr',
        id: '15120599558',
      },
    });
    expect(mockedWrite).nthCalledWith(2, {
      mappingConfigId: 'mapping-id',
      record: {
        data: {
          fodselsnr: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
          slektsnavn: { value: { oneofKind: 'stringValue', stringValue: 'FAMILIE' } },
          fornavn: { value: { oneofKind: 'stringValue', stringValue: 'OLE' } },
          familienummer: { value: { oneofKind: 'doubleValue', doubleValue: 15125049580 } },
        },
        externalId: 'fodselsnr',
        id: '15125049580',
      },
    });
  });

  it('returns correct response', () => {
    expect(returnedValue.hasError).toBe(false);
    expect(returnedValue.errorResults.length).toBe(0);
    expect(returnedValue.results.length).toBe(2);
    expect(returnedValue.results[0].id).toBe('15120599558');
    expect(returnedValue.results[0].index).toBe(0);
    expect(returnedValue.results[0].isError()).toBe(false);
    expect(returnedValue.results[0].isSuccess()).toBe(true);
    expect(returnedValue.results[1].id).toBe('15125049580');
    expect(returnedValue.results[1].index).toBe(1);
    expect(returnedValue.results[1].isError()).toBe(false);
    expect(returnedValue.results[1].isSuccess()).toBe(true);
  });
});

describe('when an error is returned', () => {
  const error = new Error('Mock error');
  let mockedClient: ClientMock;
  let caughtError: unknown;

  beforeEach(async () => {
    mockedClient = new ClientMock();

    const mockFunc = jest.fn().mockImplementation(() => mockedClient);
    jest.spyOn(sdk['client'], 'streamRecords').mockImplementation(mockFunc);

    const stream = new Stream.Readable({
      objectMode: true,
      read: jest.fn(),
    });
    stream.destroy(error);

    try {
      await sdk.ingest('mapping-id', 'fodselsnr', stream);
    } catch (err) {
      caughtError = err;
    }
  });

  describe('when an empty list of objects is sent', () => {
    beforeEach(async () => {
      try {
        await sdk.ingest('mapping-id', 'fodselsnr', []);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws the error', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('when a record error result is returned', () => {
  let mockedClient: ClientMock;
  let returnedValue: IngestResults;

  beforeEach(async () => {
    let indexCounter = 0;
    mockedClient = new ClientMock();
    jest.spyOn(mockedClient, 'write').mockImplementation((obj: { record: { id: string } }) => {
      mockedClient.emit('data', {
        recordId: obj.record.id,
        recordIndex: indexCounter++,
        error: {
          oneofKind: 'recordError',
          recordError: {
            propertyErrors: {
              property1: {
                messages: ['Error in property1'],
              },
            },
          },
        },
      } as StreamRecordsResponse);
    });
    jest.spyOn(mockedClient, 'end').mockImplementation(() => {
      indexCounter = 0;
      mockedClient.emit('end');
    });

    const mockFunc = jest.fn().mockImplementation(() => mockedClient);
    jest.spyOn(sdk['client'], 'streamRecords').mockImplementation(mockFunc);

    const stream = new Stream.Readable({
      objectMode: true,
      read: jest.fn(),
    });
    stream.push({
      fodselsnr: 15120599558,
      slektsnavn: 'FAMILIE',
      fornavn: 'ULF',
      familienummer: 15125049580,
      mors_fodselsnr: 15125149682,
      fars_fodselsnr: 15125049580,
    });
    stream.push(null);

    returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', stream);
  });

  it('returns correct response', () => {
    expect(returnedValue.hasError).toBe(true);
    expect(returnedValue.errorResults.length).toBe(1);
    expect(returnedValue.results.length).toBe(1);
    expect(returnedValue.results[0].id).toBe('15120599558');
    expect(returnedValue.results[0].index).toBe(0);
    expect(returnedValue.results[0].isError()).toBe(true);
    expect(returnedValue.results[0].isSuccess()).toBe(false);
    expect(returnedValue.errorResults[0].id).toBe('15120599558');
    expect(returnedValue.errorResults[0].index).toBe(0);
    expect(returnedValue.errorResults[0].isError()).toBe(true);
    expect(returnedValue.errorResults[0].isSuccess()).toBe(false);
    expect(returnedValue.errorResults[0].propertyErrors).toEqual({
      property1: ['Error in property1'],
    });
    expect(returnedValue.errorResults[0].errorCode).toBeUndefined();
    expect(returnedValue.errorResults[0].errorDetails).toBeUndefined();
    expect(returnedValue.errorResults[0].errorMessage).toBeUndefined();
  });
});

describe('when a status error result is returned', () => {
  let mockedClient: ClientMock;
  let returnedValue: IngestResults;

  beforeEach(async () => {
    let indexCounter = 0;
    mockedClient = new ClientMock();
    jest.spyOn(mockedClient, 'write').mockImplementation((obj: { record: { id: string } }) => {
      mockedClient.emit('data', {
        recordId: obj.record.id,
        recordIndex: indexCounter++,
        error: {
          oneofKind: 'statusError',
          statusError: {
            code: 500,
            message: 'Server error',
            details: [
              Any.create({
                typeUrl: Any.typeNameToUrl(StringValue.typeName),
                value: StringValue.toBinary(StringValue.fromJson('Details')),
              }),
            ],
          },
        },
      } as StreamRecordsResponse);
    });
    jest.spyOn(mockedClient, 'end').mockImplementation(() => {
      indexCounter = 0;
      mockedClient.emit('end');
    });

    const mockFunc = jest.fn().mockImplementation(() => mockedClient);
    jest.spyOn(sdk['client'], 'streamRecords').mockImplementation(mockFunc);

    const stream = new Stream.Readable({
      objectMode: true,
      read: jest.fn(),
    });
    stream.push({
      fodselsnr: 15120599558,
      slektsnavn: 'FAMILIE',
      fornavn: 'ULF',
      familienummer: 15125049580,
      mors_fodselsnr: 15125149682,
      fars_fodselsnr: 15125049580,
    });
    stream.push(null);

    returnedValue = await sdk.ingest('mapping-id', 'fodselsnr', stream);
  });

  it('returns correct response', () => {
    expect(returnedValue.hasError).toBe(true);
    expect(returnedValue.errorResults.length).toBe(1);
    expect(returnedValue.results.length).toBe(1);
    expect(returnedValue.results[0].id).toBe('15120599558');
    expect(returnedValue.results[0].index).toBe(0);
    expect(returnedValue.results[0].isError()).toBe(true);
    expect(returnedValue.results[0].isSuccess()).toBe(false);
    expect(returnedValue.errorResults[0].id).toBe('15120599558');
    expect(returnedValue.errorResults[0].index).toBe(0);
    expect(returnedValue.errorResults[0].isError()).toBe(true);
    expect(returnedValue.errorResults[0].isSuccess()).toBe(false);
    expect(returnedValue.errorResults[0].propertyErrors).toEqual({});
    expect(returnedValue.errorResults[0].errorCode).toBe(500);
    expect(returnedValue.errorResults[0].errorMessage).toBe('Server error');
    expect(returnedValue.errorResults[0].errorDetails).toBeDefined();
  });
});
