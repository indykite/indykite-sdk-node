import {
  IdentityKnowledgeRequest,
  IdentityKnowledgeResponse,
} from '../../../grpc/indykite/knowledge/v1beta1/identity_knowledge_api';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';
import { IdentityKnowledgeClient } from '../../knowledge';
import { Operation } from '../../../grpc/indykite/knowledge/v1beta1/model';
import { applicationTokenMock } from '../../utils/test_utils';
import { Utils } from '../../utils/utils';

let sdk: IdentityKnowledgeClient;

beforeAll(async () => {
  sdk = await IdentityKnowledgeClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('identityKnowledge', () => {
  describe('when the response does not contain an error', () => {
    let result: IdentityKnowledgeResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              paths: [
                {
                  nodes: [
                    {
                      id: 'gid:abc',
                      externalId: '1010',
                      type: 'Person',
                      tags: [],
                      properties: [
                        {
                          key: 'abc',
                          value: Value.fromJson(Utils.objectToJsonValue('something')),
                        },
                      ],
                    },
                    {
                      id: 'gid:cba',
                      externalId: '0101',
                      type: 'Truck',
                      properties: [],
                      tags: [],
                    },
                  ],
                  relationships: [
                    {
                      id: 'gid:xxx',
                      externalId: '999',
                      type: 'SERVICES',
                      source: '',
                      target: '',
                      properties: {},
                    },
                  ],
                },
              ],
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledge').mockImplementation(mockFunc);

      result = await sdk.identityKnowledge({
        operation: Operation.READ,
        path: '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
        conditions: 'WHERE n.external_id = "1234"',
      } as IdentityKnowledgeRequest);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
          conditions: 'WHERE n.external_id = "1234"',
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.paths.length).toEqual(1);
      expect(result.paths[0].nodes.length).toEqual(2);
      expect(result.paths[0].nodes[0].id).toEqual('gid:abc');
      expect(result.paths[0].relationships.length).toEqual(1);
      expect(result.paths[0].relationships[0].id).toEqual('gid:xxx');
    });
  });

  describe('when the response does not contain any value', () => {
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledge').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.identityKnowledge({
          operation: Operation.READ,
          path: '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
          conditions: 'WHERE n.external_id = "1234"',
        } as IdentityKnowledgeRequest);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledge').mockImplementation(mockFunc);

      try {
        await sdk.identityKnowledge({
          operation: Operation.READ,
          path: '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
          conditions: 'WHERE n.external_id = "1234"',
        } as IdentityKnowledgeRequest);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});
