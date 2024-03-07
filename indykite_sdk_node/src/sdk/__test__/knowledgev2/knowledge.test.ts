import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';

import {
  IdentityKnowledgeReadRequest,
  IdentityKnowledgeReadResponse,
} from '../../../grpc/indykite/knowledge/v1beta2/identity_knowledge_api';
import { Value } from '../../../grpc/indykite/objects/v1beta2/value';
import { IdentityKnowledgeReadClient } from '../../knowledgev2';
import { Node } from '../../../grpc/indykite/knowledge/objects/v1beta1/ikg';
import { applicationTokenMock } from '../../utils/test_utils';
import { Utils } from '../../utils/utils';

let sdk: IdentityKnowledgeReadClient;

beforeAll(async () => {
  sdk = await IdentityKnowledgeReadClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('identityKnowledge', () => {
  describe('when the response does not contain an error', () => {
    let result: IdentityKnowledgeReadResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                      metadata: {
                        assuranceLevel: 1,
                        verificationTime: Utils.dateToTimestamp(new Date()),
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
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.identityKnowledgeRead({
        query: 'MATCH (n:DigitalTwin) WHERE n.external_id = $externalId and n.type=$type',
        inputParams: {
          externalId: {
            type: {
              oneofKind: 'stringValue',
              stringValue: '1010',
            },
          },
          type: {
            type: {
              oneofKind: 'stringValue',
              stringValue: 'Person',
            },
          },
        },
        returns: [{ variable: 'n', properties: [] }],
      } as IdentityKnowledgeReadRequest);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:DigitalTwin) WHERE n.external_id = $externalId and n.type=$type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '1010',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.nodes.length).toEqual(2);
      expect(result.nodes[0].id).toEqual('gid:abc');
      expect(result.nodes[0].properties[0].metadata?.assuranceLevel).toEqual(1);
      expect(result.relationships.length).toEqual(1);
      expect(result.relationships[0].id).toEqual('gid:xxx');
    });
  });

  describe('when the response does not contain any value', () => {
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.identityKnowledgeRead({
          query: 'MATCH (n:DigitalTwin) WHERE n.external_id = $externalId and n.type=$type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '8163',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        } as IdentityKnowledgeReadRequest);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeReadClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        await sdk.identityKnowledgeRead({
          query:
            'MATCH (n:DigitalTwin)-[:SERVICES]->(n:Truck) WHERE n.external_id = $externalId and n.type=$type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '1234',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        } as IdentityKnowledgeReadRequest);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('parseSingleNodeFromNodes', () => {
  it('empty', () => {
    const sdkProto = Object.getPrototypeOf(sdk);
    try {
      sdkProto.parseSingleNodeFromNodes();
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
    try {
      sdkProto.parseSingleNodeFromNodes([
        {
          nodes: undefined,
        },
      ]);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
    try {
      sdkProto.parseSingleNodeFromNodes([
        {
          nodes: [],
        },
      ]);
    } catch (error) {
      expect(error).not.toBeUndefined();
    }
  });
});

describe('read', () => {
  describe('when the response does not contain an error', () => {
    let result: IdentityKnowledgeReadResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                      metadata: {
                        assuranceLevel: 1,
                        verificationTime: Utils.dateToTimestamp(new Date()),
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
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.read(
        'MATCH (:DigitalTwin)-[:SERVICES]->(n:Truck) WHERE n.external_id = $externalId and n.type=$type',
        {
          externalId: '1010',
          type: 'Person',
        },
        [{ variable: 'n', properties: [] }],
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query:
            'MATCH (:DigitalTwin)-[:SERVICES]->(n:Truck) WHERE n.external_id = $externalId and n.type=$type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '1010',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.nodes.length).toEqual(2);
      expect(result.nodes[0].id).toEqual('gid:abc');
      expect(result.nodes[0].properties[0].metadata?.assuranceLevel).toEqual(1);
      expect(result.relationships.length).toEqual(1);
      expect(result.relationships[0].id).toEqual('gid:xxx');
    });
  });

  describe('when the response does not contain any value', () => {
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.read(
          'MATCH (:DigitalTwin)-[:SERVICES]->(n:Truck) WHERE n.external_id = $externalId and n.type=$type',
          {
            externalId: '1010',
            type: 'Person',
          },
          [{ variable: 'n', properties: [] }],
        );
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeReadClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        await sdk.read(
          'MATCH (:DigitalTwin)-[:SERVICES]->(n:Truck) WHERE n.external_id = $externalId and n.type=$type',
          {
            externalId: '1010',
            type: 'Person',
          },
          [{ variable: 'n', properties: [] }],
        );
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
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                      metadata: {
                        assuranceLevel: 1,
                        verificationTime: Utils.dateToTimestamp(new Date()),
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
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);
      result = await sdk.listNodes('Resource');
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:Resource)',
          inputParams: {},
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(4);
      expect(result[0].id).toEqual('gid:abc');
      expect(result[0].properties[0].metadata?.assuranceLevel).toEqual(1);
    });
  });

  describe('when the response does not contain any value', () => {
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.listNodes('Wherever');
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeReadClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        await sdk.listNodes('Whatever');
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
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                      metadata: {
                        assuranceLevel: 1,
                        verificationTime: Utils.dateToTimestamp(new Date()),
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
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.listNodesByProperty(
        {
          type: 'email',
          value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
        },
        false,
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(4);
      expect(result[0].id).toEqual('gid:abc');
      expect(result[0].properties[0].metadata?.assuranceLevel).toEqual(1);
    });
  });

  describe('when the response does not contain any value', () => {
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.listNodesByProperty(
          {
            type: 'email',
            value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
          },
          false,
        );
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeReadClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        await sdk.listNodesByProperty(
          {
            type: 'email',
            value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
          },
          false,
        );
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
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                      metadata: {
                        assuranceLevel: 1,
                        verificationTime: Utils.dateToTimestamp(new Date()),
                        source: 'BRI',
                        customMetadata: {
                          othercustomerdata: {
                            type: {
                              oneofKind: 'stringValue',
                              stringValue: 'SomeOtherCustomData',
                            },
                          },
                        },
                      },
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.getNodeByID('gid:abc', true);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:DigitalTwin) WHERE n.id = $id',
          inputParams: {
            id: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'gid:abc',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
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
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.getNodeByID('gid:abc', false);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeReadClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        await sdk.getNodeByID('gid:abc', true);
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
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.getNodeByIdentifier(
        {
          externalId: '1010',
          type: 'Person',
        },
        true,
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:DigitalTwin) WHERE n.external_id = $externalId AND n.type = $type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '1010',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
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
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.getNodeByIdentifier(
          {
            externalId: '120',
            type: 'Person',
          },
          true,
        );
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No IdentityKnowledgeReadClient response.');
    });
  });

  describe('when the response returns an error', () => {
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IdentityKnowledgeReadRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      try {
        await sdk.getNodeByIdentifier(
          {
            externalId: '11',
            type: 'Person',
          },
          true,
        );
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('getIdentityByID', () => {
  describe('when the response does not contain an error', () => {
    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);
      await sdk.getIdentityByID('gid:abc');
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:DigitalTwin) WHERE n.id = $id',
          inputParams: {
            id: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'gid:abc',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });
  });
});

describe('listIdentities', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.listIdentities();
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:DigitalTwin)',
          inputParams: {},
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(4);
      expect(result[0].id).toEqual('gid:abc');
    });
  });
});

describe('listIdentitiesByProperty', () => {
  describe('when the response does not contain an error', () => {
    let result: Node[];

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.listIdentitiesByProperty({
        type: 'email',
        value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
    });

    it('returns a correct response', () => {
      expect(result.length).toEqual(4);
      expect(result[0].id).toEqual('gid:abc');
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
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.getNodeByIdentifier(
        {
          externalId: '11',
          type: 'Person',
        },
        false,
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:Resource) WHERE n.external_id = $externalId AND n.type = $type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '11',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.id).toEqual('gid:abc');
    });
  });
});

describe('getIdentityByIdentifier', () => {
  describe('when the response does not contain an error', () => {
    let result: Node;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          req,
          res:
            | Metadata
            | CallOptions
            | ((err: ServiceError | null, response: IdentityKnowledgeReadResponse) => void),
        ): SurfaceCall => {
          if (typeof res === 'function')
            res(null, {
              nodes: [
                {
                  id: 'gid:abc',
                  externalId: '1010',
                  type: 'Person',
                  tags: [],
                  properties: [
                    {
                      type: 'abc',
                      value: Value.fromJson(Utils.objectToJsonValue('something')),
                      metadata: {
                        assuranceLevel: 1,
                        verificationTime: Utils.dateToTimestamp(new Date()),
                        source: 'BRI',
                        customMetadata: {
                          othercustomerdata: {
                            type: {
                              oneofKind: 'stringValue',
                              stringValue: 'SomeOtherCustomData',
                            },
                          },
                        },
                      },
                    },
                  ],
                  isIdentity: true,
                },
                {
                  id: 'gid:cba',
                  externalId: '0101',
                  type: 'Truck',
                  properties: [],
                  tags: [],
                  isIdentity: false,
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
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'identityKnowledgeRead').mockImplementation(mockFunc);

      result = await sdk.getIdentityByIdentifier({
        externalId: '1010',
        type: 'Person',
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledTimes(1);
      expect(sdk['client'].identityKnowledgeRead).toHaveBeenCalledWith(
        {
          query: 'MATCH (n:DigitalTwin) WHERE n.external_id = $externalId AND n.type = $type',
          inputParams: {
            externalId: {
              type: {
                oneofKind: 'stringValue',
                stringValue: '1010',
              },
            },
            type: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'Person',
              },
            },
          },
          returns: [{ variable: 'n', properties: [] }],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.id).toEqual('gid:abc');
    });
  });
});
