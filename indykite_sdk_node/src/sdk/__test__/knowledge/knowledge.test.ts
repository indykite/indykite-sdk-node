import {
  IdentityKnowledgeRequest,
  IdentityKnowledgeResponse,
} from '../../../grpc/indykite/knowledge/v1beta1/identity_knowledge_api';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';
import { IdentityKnowledgeClient } from '../../knowledge';
import { Node, Operation } from '../../../grpc/indykite/knowledge/v1beta1/model';
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
        inputParams: {},
      } as IdentityKnowledgeRequest);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
          conditions: 'WHERE n.external_id = "1234"',
          inputParams: {},
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
          inputParams: {},
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
          inputParams: {},
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

describe('parseSingleNodeFromPaths', () => {
  it('empty', () => {
    const sdkProto = Object.getPrototypeOf(sdk);
    try {
      sdkProto.parseSingleNodeFromPaths();
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
    try {
      sdkProto.parseSingleNodeFromPaths([
        {
          nodes: undefined,
        },
      ]);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
    try {
      sdkProto.parseSingleNodeFromPaths([
        {
          nodes: [],
        },
      ]);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
  });

  it('has data', () => {
    const sdkProto = Object.getPrototypeOf(sdk);
    expect(
      sdkProto.parseSingleNodeFromPaths([
        {
          nodes: [
            {
              data: 1,
            },
          ],
        },
      ]),
    ).toEqual({ data: 1 });
  });
});

describe('parseMultipleNodesFromPaths', () => {
  it('empty', () => {
    const sdkProto = Object.getPrototypeOf(sdk);
    expect(sdkProto.parseMultipleNodesFromPaths()).toEqual([]);
  });
  it('empty', () => {
    const sdkProto = Object.getPrototypeOf(sdk);
    expect(sdkProto.parseMultipleNodesFromPaths([{}])).toEqual([]);
  });

  it('has data', () => {
    const sdkProto = Object.getPrototypeOf(sdk);
    expect(
      sdkProto.parseMultipleNodesFromPaths([
        {
          nodes: [
            {
              data: 1,
            },
          ],
        },
      ]),
    ).toEqual([{ data: 1 }]);
  });
});

describe('read', () => {
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

      result = await sdk.read(
        '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
        'WHERE n.external_id = "1234"',
        {},
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(:DigitalTwin)-[:SERVICES]->(n:Truck)',
          conditions: 'WHERE n.external_id = "1234"',
          inputParams: {},
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
        await sdk.read('(:DigitalTwin)-[:SERVICES]->(n:Truck)', 'WHERE n.external_id = "1234"', {});
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
        await sdk.read('(:DigitalTwin)-[:SERVICES]->(n:Truck)', 'WHERE n.external_id = "1234"', {});
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('listNodes', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

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

      result = await sdk.listNodes('DigitalTwin');
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          conditions: '',
          inputParams: {},
          operation: Operation.READ,
          path: '(:DigitalTwin)',
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('gid:abc');
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
        await sdk.listNodes('DigitalTwin');
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
        await sdk.listNodes('DigitalTwin');
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('listNodesByProperty', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

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

      result = await sdk.listNodesByProperty('DigitalTwin', {
        key: 'email',
        value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:DigitalTwin)',
          conditions: 'WHERE n.email = $email',
          inputParams: {
            email: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'user@example.com',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('gid:abc');
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
        await sdk.listNodesByProperty('DigitalTwin', {
          key: 'email',
          value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
        });
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
        await sdk.listNodesByProperty('DigitalTwin', {
          key: 'email',
          value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
        });
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('getNodeByID', () => {
  describe('when the response does not contain an error', () => {
    let result: Node;

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

      result = await sdk.getNodeByID('gid:abc', 'DigitalTwin');
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:DigitalTwin)',
          conditions: 'WHERE n.id = $id',
          inputParams: {
            id: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'gid:abc',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.id).toEqual('gid:abc');
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
        await sdk.getNodeByID('gid:abc', 'DigitalTwin');
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
        await sdk.getNodeByID('gid:abc', 'DigitalTwin');
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('getNodeByIdentifier', () => {
  describe('when the response does not contain an error', () => {
    let result: Node;

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

      result = await sdk.getNodeByIdentifier('DigitalTwin', {
        externalId: '11',
        type: 'string',
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:DigitalTwin)',
          conditions: 'WHERE n.external_id = $externalId AND n.type = $type',
          inputParams: {
            externalId: {
              value: {
                oneofKind: 'stringValue',
                stringValue: '11',
              },
            },
            type: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'string',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.id).toEqual('gid:abc');
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
        await sdk.getNodeByIdentifier('DigitalTwin', {
          externalId: '11',
          type: 'string',
        });
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
        await sdk.getNodeByIdentifier('DigitalTwin', {
          externalId: '11',
          type: 'string',
        });
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('getDigitalTwinByID', () => {
  describe('when the response does not contain an error', () => {
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
      await sdk.getDigitalTwinByID('gid:abc');
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:DigitalTwin)',
          conditions: 'WHERE n.id = $id',
          inputParams: {
            id: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'gid:abc',
              },
            },
          },
        },
        expect.any(Function),
      );
    });
  });
});

describe('getResourceByID', () => {
  describe('when the response does not contain an error', () => {
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
      await sdk.getResourceByID('gid:abc');
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:Resource)',
          conditions: 'WHERE n.id = $id',
          inputParams: {
            id: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'gid:abc',
              },
            },
          },
        },
        expect.any(Function),
      );
    });
  });
});

describe('listDigitalTwins', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

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

      result = await sdk.listDigitalTwins();
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          conditions: '',
          inputParams: {},
          operation: Operation.READ,
          path: '(:DigitalTwin)',
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('gid:abc');
    });
  });
});

describe('listResources', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

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

      result = await sdk.listResources();
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          conditions: '',
          inputParams: {},
          operation: Operation.READ,
          path: '(:Resource)',
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('gid:abc');
    });
  });
});

describe('listResourcesByProperty', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

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

      result = await sdk.listResourcesByProperty({
        key: 'email',
        value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:Resource)',
          conditions: 'WHERE n.email = $email',
          inputParams: {
            email: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'user@example.com',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('gid:abc');
    });
  });
});

describe('listDigitalTwinsByProperty', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

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

      result = await sdk.listDigitalTwinsByProperty({
        key: 'email',
        value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:DigitalTwin)',
          conditions: 'WHERE n.email = $email',
          inputParams: {
            email: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'user@example.com',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(2);
      expect(result[0].id).toEqual('gid:abc');
    });
  });
});

describe('getResourceByIdentifier', () => {
  describe('when the response does not contain an error', () => {
    let result: Node;

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

      result = await sdk.getResourceByIdentifier({
        externalId: '11',
        type: 'string',
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:Resource)',
          conditions: 'WHERE n.external_id = $externalId AND n.type = $type',
          inputParams: {
            externalId: {
              value: {
                oneofKind: 'stringValue',
                stringValue: '11',
              },
            },
            type: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'string',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.id).toEqual('gid:abc');
    });
  });
});

describe('getDigitalTwinByIdentifier', () => {
  describe('when the response does not contain an error', () => {
    let result: Node;

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

      result = await sdk.getDigitalTwinByIdentifier({
        externalId: '11',
        type: 'string',
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledge).toBeCalledTimes(1);
      expect(sdk['client'].identityKnowledge).toBeCalledWith(
        {
          operation: Operation.READ,
          path: '(n:DigitalTwin)',
          conditions: 'WHERE n.external_id = $externalId AND n.type = $type',
          inputParams: {
            externalId: {
              value: {
                oneofKind: 'stringValue',
                stringValue: '11',
              },
            },
            type: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'string',
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.id).toEqual('gid:abc');
    });
  });
});
