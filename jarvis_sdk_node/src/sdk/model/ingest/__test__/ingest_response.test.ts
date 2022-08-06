import { Any } from '../../../../grpc/google/protobuf/any';
import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import { IngestResults } from '../ingest_response';

let results: IngestResults;

beforeEach(() => {
  results = new IngestResults();
});

describe('when a success result is added', () => {
  beforeEach(() => {
    results.deserializeAndAdd({
      recordId: 'record-id',
      recordIndex: 42,
      error: { oneofKind: undefined },
    });
  });

  it('has correct attributes', () => {
    expect(results.hasError).toBe(false);
    expect(results.errorResults.length).toBe(0);
    expect(results.results.length).toBe(1);
    expect(results.results[0].id).toBe('record-id');
    expect(results.results[0].index).toBe(42);
    expect(results.results[0].isSuccess()).toBe(true);
    expect(results.results[0].isError()).toBe(false);
  });

  describe('when an error result is added', () => {
    beforeEach(() => {
      results.deserializeAndAdd({
        recordId: 'second-record-id',
        recordIndex: 43,
        error: {
          oneofKind: 'statusError',
          statusError: {
            code: 500,
            message: 'Error',
            details: [
              Any.create({
                typeUrl: Any.typeNameToUrl(StringValue.typeName),
                value: StringValue.toBinary(StringValue.fromJson('Details')),
              }),
            ],
          },
        },
      });
    });

    it('has correct attributes', () => {
      expect(results.hasError).toBe(true);
      expect(results.results.length).toBe(2);
      expect(results.results[0].id).toBe('record-id');
      expect(results.results[0].index).toBe(42);
      expect(results.results[0].isSuccess()).toBe(true);
      expect(results.results[0].isError()).toBe(false);
      expect(results.results[1].id).toBe('second-record-id');
      expect(results.results[1].index).toBe(43);
      expect(results.results[1].isSuccess()).toBe(false);
      expect(results.results[1].isError()).toBe(true);

      expect(results.errorResults.length).toBe(1);
      expect(results.errorResults[0].id).toBe('second-record-id');
      expect(results.errorResults[0].index).toBe(43);
      expect(results.errorResults[0].isSuccess()).toBe(false);
      expect(results.errorResults[0].isError()).toBe(true);
      expect(results.errorResults[0].errorCode).toBe(500);
      expect(results.errorResults[0].errorMessage).toBe('Error');
      expect(results.errorResults[0].errorDetails).toBeDefined();
      expect(results.errorResults[0].propertyErrors).toEqual({});
    });
  });
});

describe('when an error result is added', () => {
  beforeEach(() => {
    results.deserializeAndAdd({
      recordId: 'second-record-id',
      recordIndex: 43,
      error: {
        oneofKind: 'recordError',
        recordError: {
          propertyErrors: {
            property1: {
              messages: ['Error'],
            },
          },
        },
      },
    });
  });

  it('has correct attributes', () => {
    expect(results.hasError).toBe(true);
    expect(results.results.length).toBe(1);
    expect(results.results[0].id).toBe('second-record-id');
    expect(results.results[0].index).toBe(43);
    expect(results.results[0].isSuccess()).toBe(false);
    expect(results.results[0].isError()).toBe(true);

    expect(results.errorResults.length).toBe(1);
    expect(results.errorResults[0].id).toBe('second-record-id');
    expect(results.errorResults[0].index).toBe(43);
    expect(results.errorResults[0].isSuccess()).toBe(false);
    expect(results.errorResults[0].isError()).toBe(true);
    expect(results.errorResults[0].errorCode).toBeUndefined();
    expect(results.errorResults[0].errorMessage).toBeUndefined();
    expect(results.errorResults[0].errorDetails).toBeUndefined();
    expect(results.errorResults[0].propertyErrors).toEqual({
      property1: ['Error'],
    });
  });
});
