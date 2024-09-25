import { SdkClient } from './client/client';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta3/ingest_api.grpc-client';
import {
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsRequest,
  StreamRecordsResponse,
  BatchUpsertNodesRequest,
  BatchUpsertNodesResponse,
  BatchDeleteNodesRequest,
  BatchDeleteNodesResponse,
  BatchDeleteNodePropertiesRequest,
  BatchDeleteNodePropertiesResponse,
  BatchUpsertRelationshipsRequest,
  BatchUpsertRelationshipsResponse,
  BatchDeleteRelationshipsRequest,
  BatchDeleteRelationshipsResponse,
  BatchDeleteRelationshipPropertiesRequest,
  BatchDeleteRelationshipPropertiesResponse,
} from '../grpc/indykite/ingest/v1beta3/ingest_api';
import { Readable } from 'stream';
import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { IndexFixer, streamKeeper } from './utils/stream';
import { Utils } from './utils/utils';
import {
  NodeMatch,
  DeleteData_NodePropertyMatch as NodePropertyMatch,
  DeleteData_RelationshipPropertyMatch as RelationshipPropertyMatch,
  Record as RecordModel,
  Relationship,
} from '../grpc/indykite/ingest/v1beta3/model';
import {
  ExternalValue,
  Metadata,
  Node,
  Property,
} from '../grpc/indykite/knowledge/objects/v1beta1/ikg';
import { Value } from '../grpc/indykite/objects/v1beta2/value';
import { Timestamp } from '../grpc/google/protobuf/timestamp';

export interface IngestNodeRecord {
  externalId: string;
  type: string;
  tags?: string[];
  properties?: IngestProperty[];
  id?: string;
  isIdentity?: boolean;
}

export interface IngestNodeMatch {
  externalId: string;
  type: string;
}

export interface IngestNodePropertyMatch {
  match: IngestNodeMatch;
  propertyType: string;
}

export interface IngestRelationship {
  source: IngestNodeMatch;
  target: IngestNodeMatch;
  type: string;
  properties?: IngestProperty[];
}

export interface IngestRelationshipProperty {
  source: IngestNodeMatch;
  target: IngestNodeMatch;
  type: string;
  propertyType: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface IngestProperty {
  type: string;
  value?: any;
  externalValue?: ExternalValue;
  metadata?: IngestMetadata;
}

export interface IngestMetadata {
  assuranceLevel: 1 | 2 | 3;
  verificationTime: Timestamp;
  source: string;
  customMetadata: { [key: string]: string };
}

export interface DeleteRelationship {
  source: IngestNodeMatch;
  target: IngestNodeMatch;
  type: string;
  properties?: DeleteProperty[];
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface DeleteProperty {
  type: string;
  value?: any;
  externalValue?: ExternalValue;
  metadata?: Metadata;
}

export class IngestRecord {
  protected request: IngestRecordRequest;

  /**
   * @param id Unique identifier of the record, for client side reference
   */
  static delete(id: string) {
    return new IngestRecordDelete(id);
  }

  /**
   * @param id Unique identifier of the record, for client side reference
   */
  static upsert(id: string) {
    return new IngestRecordUpsert(id);
  }

  constructor(request?: IngestRecordRequest) {
    if (request) {
      this.request = request;
      return;
    }

    this.request = {
      record: undefined,
    };
  }

  marshal(): IngestRecordRequest {
    return this.request;
  }

  getRecord(): RecordModel {
    return this.request.record as RecordModel;
  }
}

export class IngestRecordUpsert extends IngestRecord {
  constructor(id: string) {
    super();
    this.request.record = {
      id,
      operation: {
        oneofKind: 'upsert',
        upsert: {
          data: {
            oneofKind: undefined,
          },
        },
      },
    };
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').node({
   *     externalId: 'lot-1',
   *     type: 'ParkingLot'
   *     properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata":'SomeCustomData'
   *            },
   *          }
   *       }],
   *   })
   * );
   */
  node(node: IngestNodeRecord) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'upsert') return defaultRecord;

    const properties = [] as Property[];
    if (node.properties) {
      for (const property of node.properties) {
        const metadata = {} as Metadata;

        if (property.metadata?.assuranceLevel) {
          metadata['assuranceLevel'] = property.metadata.assuranceLevel;
        }
        if (property.metadata?.verificationTime) {
          metadata['verificationTime'] = property.metadata.verificationTime;
        }
        if (property.metadata?.source) {
          metadata['source'] = property.metadata.source;
        }
        if (property.metadata?.customMetadata) {
          const listCustom: { [key: string]: Value } = {};
          for (const [key, value] of Object.entries(property.metadata?.customMetadata)) {
            listCustom[key] = Value.fromJson(Utils.objectToJsonValue(value));
          }
          metadata['customMetadata'] = listCustom;
        }
        if (property.value && property.externalValue) {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_7,
            SkdErrorText.SDK_CODE_7('both value and externalValue'),
          );
        }
        if (property.value) {
          properties.push({
            type: property.type,
            value: Value.fromJson(Utils.objectToJsonValue(property.value)),
            metadata: property.metadata ? metadata : undefined,
          });
        } else if (property.externalValue) {
          properties.push({
            type: property.type,
            externalValue: property.externalValue,
            metadata: property.metadata ? metadata : undefined,
          });
        } else {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_8,
            SkdErrorText.SDK_CODE_8('value or externalValue'),
          );
        }
      }
    }
    operation.upsert.data = {
      oneofKind: 'node',
      node: {
        ...node,
        tags: node.tags ?? [],
        properties: properties ?? [],
        id: node.id ?? '',
        isIdentity: node.isIdentity ?? false,
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').relationship({
   *     source: { externalId: 'vehicle-1', type: 'Vehicle' },
   *     target: { externalId: 'lot-1', type: 'ParkingLot' },
   *     type: 'CAN_USE'
   *   })
   * );
   */
  relationship(relationship: IngestRelationship) {
    if (!this.request.record) return new IngestRecord(this.request);

    const operation = this.request.record.operation;
    if (operation.oneofKind === 'upsert') {
      const properties = [] as Property[];
      if (relationship.properties) {
        for (const property of relationship.properties) {
          const metadata = {} as Metadata;

          if (property.metadata?.assuranceLevel) {
            metadata['assuranceLevel'] = property.metadata.assuranceLevel;
          }
          if (property.metadata?.verificationTime) {
            metadata['verificationTime'] = property.metadata.verificationTime;
          }
          if (property.metadata?.source) {
            metadata['source'] = property.metadata.source;
          }
          if (property.metadata?.customMetadata) {
            const listCustom: { [key: string]: Value } = {};
            for (const [key, value] of Object.entries(property.metadata?.customMetadata)) {
              listCustom[key] = Value.fromJson(Utils.objectToJsonValue(value));
            }
            metadata['customMetadata'] = listCustom;
          }
          if (property.value && property.externalValue) {
            throw new SdkError(
              SdkErrorCode.SDK_CODE_7,
              SkdErrorText.SDK_CODE_7('both value and externalValue'),
            );
          }
          if (property.value) {
            properties.push({
              type: property.type,
              value: Value.fromJson(Utils.objectToJsonValue(property.value)),
              metadata: property.metadata ? metadata : undefined,
            });
          } else if (property.externalValue) {
            properties.push({
              type: property.type,
              externalValue: property.externalValue,
              metadata: property.metadata ? metadata : undefined,
            });
          } else {
            throw new SdkError(
              SdkErrorCode.SDK_CODE_8,
              SkdErrorText.SDK_CODE_8('value or externalValue'),
            );
          }
        }
      }

      operation.upsert.data = {
        oneofKind: 'relationship',
        relationship: {
          ...relationship,
          properties: properties ?? [],
        },
      };
    }

    return new IngestRecord(this.request);
  }
}

export class IngestRecordDelete extends IngestRecord {
  constructor(id: string) {
    super();
    this.request.record = {
      id,
      operation: {
        oneofKind: 'delete',
        delete: {
          data: {
            oneofKind: undefined,
          },
        },
      },
    };
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').node({
   *     externalId: 'lot-1',
   *     type: 'ParkingLot',
   *   })
   * );
   */
  node(node: IngestNodeMatch) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'node',
      node,
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').nodeProperty(
   *     {
   *       externalId: 'lot-1',
   *       type: 'ParkingLot',
   *     },
   *     'nodePropertyName'
   *   )
   * );
   */
  nodeProperty(match: NodeMatch, propertyType: string) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'nodeProperty',
      nodeProperty: {
        match: match,
        propertyType: propertyType,
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').relationship({
   *     source: { externalId: 'vehicle-1', type: 'Vehicle' },
   *     target: { externalId: 'lot-1', type: 'ParkingLot' },
   *     type: 'CAN_USE',
   *     properties: []
   *   })
   * );
   */
  relationship(relationship: DeleteRelationship) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'relationship',
      relationship: {
        ...relationship,
        properties: relationship.properties ?? [],
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').relationshipProperty(
   *     {
   *       source: { externalId: 'vehicle-1', type: 'Vehicle' },
   *       target: { externalId: 'lot-1', type: 'ParkingLot' },
   *       type: 'CAN_USE',
   *       propertyType: 'relationPropertyName'
   *     },
   *   )
   * );
   */
  relationshipProperty(relationshipProperty: IngestRelationshipProperty) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'relationshipProperty',
      relationshipProperty: {
        ...relationshipProperty,
      },
    };

    return new IngestRecord(this.request);
  }
}

export class BatchUpsertNodes {
  protected request: BatchUpsertNodesRequest;

  constructor(nodes?: IngestNodeRecord[]) {
    if (nodes) {
      const nodesArr = [];
      const req: any = {};
      for (const node of nodes) {
        nodesArr.push(new BatchNode(node).prepare());
      }
      req.nodes = nodesArr;
      this.request = req;
      return;
    }

    this.request = {
      nodes: [],
    };
  }

  marshal(): BatchUpsertNodesRequest {
    return this.request;
  }

  getNodes(): Node[] {
    return this.request.nodes as Node[];
  }
}

export class BatchDeleteNodes {
  protected request: BatchDeleteNodesRequest;

  constructor(nodes?: IngestNodeMatch[]) {
    if (nodes) {
      const nodesArr = [];
      const req: any = {};
      for (const node of nodes) {
        nodesArr.push(new BatchNodeMatch(node).prepare());
      }
      req.nodes = nodesArr;
      this.request = req;
      return;
    }

    this.request = {
      nodes: [],
    };
  }

  marshal(): BatchDeleteNodesRequest {
    return this.request;
  }

  getNodes(): Node[] {
    return this.request.nodes as Node[];
  }
}

export class BatchDeleteNodeProperties {
  protected request: BatchDeleteNodePropertiesRequest;

  constructor(nodeProperties?: IngestNodePropertyMatch[]) {
    if (nodeProperties) {
      const nodesArr = [];
      const req: any = {};
      for (const nodeProperty of nodeProperties) {
        nodesArr.push(new BatchNodePropertyMatch(nodeProperty).prepare());
      }
      req.nodeProperties = nodesArr;
      this.request = req;
      return;
    }

    this.request = {
      nodeProperties: [],
    };
  }

  marshal(): BatchDeleteNodePropertiesRequest {
    return this.request;
  }

  getNodeProperties(): NodePropertyMatch[] {
    return this.request.nodeProperties as NodePropertyMatch[];
  }
}

export class BatchNode {
  protected node: IngestNodeRecord;

  constructor(node: IngestNodeRecord) {
    this.node = node;
  }

  getNode(): IngestNodeRecord {
    return this.node;
  }

  prepare(): Node {
    const properties: Property[] = [];
    if (this.node.properties) {
      for (const property of this.node.properties) {
        const metadata = {} as Metadata;
        if (property.metadata?.assuranceLevel) {
          metadata['assuranceLevel'] = property.metadata.assuranceLevel;
        }
        if (property.metadata?.verificationTime) {
          metadata['verificationTime'] = property.metadata.verificationTime;
        }
        if (property.metadata?.source) {
          metadata['source'] = property.metadata.source;
        }
        if (property.metadata?.customMetadata) {
          const listCustom: { [key: string]: Value } = {};
          for (const [key, value] of Object.entries(property.metadata?.customMetadata)) {
            listCustom[key] = Value.fromJson(Utils.objectToJsonValue(value));
          }
          metadata['customMetadata'] = listCustom;
        }
        if (property.value && property.externalValue) {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_7,
            SkdErrorText.SDK_CODE_7(' both value and externalValue'),
          );
        }
        if (property.value) {
          properties.push({
            type: property.type,
            value: Value.fromJson(Utils.objectToJsonValue(property.value)),
            metadata: property.metadata ? metadata : undefined,
          });
        } else if (property.externalValue) {
          properties.push({
            type: property.type,
            externalValue: property.externalValue,
            metadata: property.metadata ? metadata : undefined,
          });
        } else {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_8,
            SkdErrorText.SDK_CODE_8('value or externalValue'),
          );
        }
      }
    }

    const node = {
      externalId: this.node.externalId ?? '',
      type: this.node.type ?? '',
      tags: this.node.tags ?? [],
      properties: properties ?? [],
      id: this.node.id ?? '',
      isIdentity: this.node.isIdentity ?? false,
    } as Node;
    return node;
  }
}

export class BatchNodeMatch {
  protected node: IngestNodeMatch;

  constructor(node: IngestNodeMatch) {
    this.node = node;
  }

  getNode(): IngestNodeMatch {
    return this.node;
  }

  prepare(): NodeMatch {
    const node = {
      externalId: this.node.externalId ?? '',
      type: this.node.type ?? '',
    } as NodeMatch;
    return node;
  }
}

export class BatchNodePropertyMatch {
  protected nodeProperty: IngestNodePropertyMatch;

  constructor(nodeProperty: IngestNodePropertyMatch) {
    this.nodeProperty = nodeProperty;
  }

  getNode(): IngestNodePropertyMatch {
    return this.nodeProperty;
  }

  prepare(): NodePropertyMatch {
    const nodeProperty = {
      match: {
        externalId: this.nodeProperty.match.externalId ?? '',
        type: this.nodeProperty.match.type ?? '',
      },
      propertyType: this.nodeProperty.propertyType ?? '',
    } as NodePropertyMatch;
    return nodeProperty;
  }
}

export class BatchUpsertRelationships {
  protected request: BatchUpsertRelationshipsRequest;

  constructor(relationships?: IngestRelationship[]) {
    if (relationships) {
      const relationshipsArr = [];
      const req: any = {};
      for (const relationship of relationships) {
        relationshipsArr.push(new BatchRelationship(relationship).prepare());
      }
      req.relationships = relationshipsArr;
      this.request = req;
      return;
    }

    this.request = {
      relationships: [],
    };
  }

  marshal(): BatchUpsertRelationshipsRequest {
    return this.request;
  }

  getRelationships(): Relationship[] {
    return this.request.relationships as Relationship[];
  }
}

export class BatchDeleteRelationships {
  protected request: BatchDeleteRelationshipsRequest;

  constructor(relationships?: IngestRelationship[]) {
    if (relationships) {
      const relationshipsArr = [];
      const req: any = {};
      for (const relationship of relationships) {
        relationshipsArr.push(new BatchRelationship(relationship).prepare());
      }
      req.relationships = relationshipsArr;
      this.request = req;
      return;
    }

    this.request = {
      relationships: [],
    };
  }

  marshal(): BatchDeleteRelationshipsRequest {
    return this.request;
  }

  getRelationships(): Relationship[] {
    return this.request.relationships as Relationship[];
  }
}

export class BatchDeleteRelationshipProperties {
  protected request: BatchDeleteRelationshipPropertiesRequest;

  constructor(relationshipProperties?: IngestRelationshipProperty[]) {
    if (relationshipProperties) {
      const relationshipsArr = [];
      const req: any = {};
      for (const relationshipProperty of relationshipProperties) {
        relationshipsArr.push(new BatchRelationshipProperty(relationshipProperty).prepare());
      }
      req.relationshipProperties = relationshipsArr;
      this.request = req;
      return;
    }

    this.request = {
      relationshipProperties: [],
    };
  }

  marshal(): BatchDeleteRelationshipPropertiesRequest {
    return this.request;
  }

  getRelationshipProperties(): RelationshipPropertyMatch[] {
    return this.request.relationshipProperties as RelationshipPropertyMatch[];
  }
}

export class BatchRelationship {
  protected relationship: IngestRelationship;

  constructor(relationship: IngestRelationship) {
    this.relationship = relationship;
  }

  getNode(): IngestRelationship {
    return this.relationship;
  }

  prepare(): Relationship {
    const properties: Property[] = [];
    if (this.relationship.properties) {
      for (const property of this.relationship.properties) {
        const metadata = {} as Metadata;
        let propertyData = {} as Property;
        if (property.metadata?.assuranceLevel) {
          metadata['assuranceLevel'] = property.metadata.assuranceLevel;
        }
        if (property.metadata?.verificationTime) {
          metadata['verificationTime'] = property.metadata.verificationTime;
        }
        if (property.metadata?.source) {
          metadata['source'] = property.metadata.source;
        }
        if (property.metadata?.customMetadata) {
          const listCustom: { [key: string]: Value } = {};
          for (const [key, value] of Object.entries(property.metadata?.customMetadata)) {
            listCustom[key] = Value.fromJson(Utils.objectToJsonValue(value));
          }
          metadata['customMetadata'] = listCustom;
        }
        if (property.value && property.externalValue) {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_7,
            SkdErrorText.SDK_CODE_7('both value and externalValue'),
          );
        }
        if (property.value) {
          propertyData = {
            type: property.type,
            value: Value.fromJson(Utils.objectToJsonValue(property.value)),
            metadata: property.metadata ? metadata : undefined,
          };
        } else if (property.externalValue) {
          propertyData = {
            type: property.type,
            externalValue: property.externalValue,
            metadata: property.metadata ? metadata : undefined,
          };
        } else {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_8,
            SkdErrorText.SDK_CODE_8('value or externalValue'),
          );
        }
        properties.push(propertyData);
      }
    }

    const relationship = {
      source: {
        externalId: this.relationship.source?.externalId ?? '',
        type: this.relationship.source?.type ?? '',
      } as IngestNodeMatch,
      target: {
        externalId: this.relationship.target?.externalId ?? '',
        type: this.relationship.target?.type ?? '',
      } as IngestNodeMatch,
      type: this.relationship?.type ?? '',
      properties: properties ?? [],
    } as Relationship;
    return relationship;
  }
}

export class BatchRelationshipProperty {
  protected relationshipProperty: IngestRelationshipProperty;

  constructor(relationshipProperty: IngestRelationshipProperty) {
    this.relationshipProperty = relationshipProperty;
  }

  getNode(): IngestRelationshipProperty {
    return this.relationshipProperty;
  }

  prepare(): RelationshipPropertyMatch {
    const relationshipProperty = {
      source: {
        externalId: this.relationshipProperty.source?.externalId ?? '',
        type: this.relationshipProperty.source?.type ?? '',
      } as IngestNodeMatch,
      target: {
        externalId: this.relationshipProperty.target?.externalId ?? '',
        type: this.relationshipProperty.target?.type ?? '',
      } as IngestNodeMatch,
      type: this.relationshipProperty?.type ?? '',
      propertyType: this.relationshipProperty.propertyType ?? [],
    } as RelationshipPropertyMatch;
    return relationshipProperty;
  }
}

/**
 * IngestAPI represents the service interface for data ingestion.
 * @category Clients
 * @since 0.4.1
 * @example
 * // Example how to create a new ingest client
 * const sdk = await IngestClient.createInstance();
 */
export class IngestClient {
  private client: IngestAPIClient;
  constructor(sdk: SdkClient) {
    this.client = sdk.client as IngestAPIClient;
  }
  static createInstance(appCredential?: string | unknown): Promise<IngestClient> {
    return new Promise<IngestClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(IngestAPIClient, appCredential)
        .then((sdk) => {
          resolve(new IngestClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * @since 0.3.4
   * @example
   * await sdk.ingestRecord(
   *   IngestRecord.upsert('recordId-1').node.resource({
   *     externalId: 'parkingLot-1',
   *     type: 'ParkingLot',
   *     properties: {
   *       customProp: '42',
   *     },
   *   }),
   * );
   */
  ingestRecord(record: IngestRecord): Promise<IngestRecordResponse> {
    const req: IngestRecordRequest = record.marshal();
    return new Promise((resolve, reject) => {
      this.client.ingestRecord(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.3.4
   * @example
   * const input = Readable.from(
   *   [
   *     IngestRecord.upsert('recordId-1').node({
   *       externalId: 'lotA',
   *       type: 'ParkingLot',
   *     }),
   *     IngestRecord.upsert('recordId-2').node({
   *       externalId: 'vehicleA',
   *       type: 'Vehicle',
   *     }),
   *     IngestRecord.upsert('recordId-3').node({
   *       externalId: 'person1',
   *       type: 'Person',
   *       properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     }),
   *     IngestRecord.upsert('recordId-4').relationship({
   *       sourceMatch: { externalId: 'person1', type: 'Person' },
   *       targetMatch: { externalId: 'vehicleA', type: 'Vehicle' },
   *       type: 'OWNS',
   *     }),
   *     IngestRecord.upsert('recordId-5').relationship({
   *       sourceMatch: { externalId: 'vehicleA', type: 'Vehicle' },
   *       targetMatch: { externalId: 'lotA', type: 'ParkingLot' },
   *       type: 'CAN_PARK',
   *     }),
   *     IngestRecord.upsert('recordId-6').node({
   *       externalId: 'person6',
   *       type: 'Person',
   *       properties: [{
   *         type: "customProp",
   *         externalValue: {resolver: {id: "gid:ioidcnvoej"}},
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     }),
   *   ],
   *   { objectMode: true },
   * );
   *
   * const output = sdk.streamRecords(input);
   */
  streamRecords(stream: Readable) {
    const [input, output] = streamKeeper(this.client.streamRecords.bind(this.client), [
      new IndexFixer('recordIndex'),
    ]);

    stream.on('data', async (chunk) => {
      if (chunk instanceof IngestRecord) {
        input.write(chunk.marshal());
      }
    });

    stream.on('end', () => {
      input.end();
    });

    return output;
  }

  /**
   * @since 0.4.1
   * @example
   *   const input = [
   *     IngestRecord.upsert('recordId-3').node({
   *       externalId: 'tom',
   *       type: 'Person',
   *       properties: [
   *         {
   *            type: "employeeId",
   *            value: 123
   *         },
   *         {
   *          type: "name",
   *          value: "Tom Doe"
   *         }
   *        ]
   *       },
   *       isIdentity: true
   *     }).getRecord(),
   *     IngestRecord.upsert('recordId-3').node({
   *       externalId: 'w_west_g1',
   *       type: 'UserGroup',
   *       properties: [
   *          {
   *            type: "name",
   *            value: "west"
   *          }
   *       ]
   *     }).getRecord(),
   *     IngestRecord.upsert('recordId-3').relationship({
   *       sourceMatch: { externalId: 'tom', type: 'Person' },
   *       targetMatch: { externalId: 'w_west_g1', type: 'UserGroup' },
   *       type: 'BELONGS',
   *     }).getRecord(),
   *   ];
   *   await sdk.streamRecords(input)
   */
  streamRecordsArray(records: RecordModel[]): Promise<StreamRecordsResponse[]> {
    return new Promise((resolve, reject) => {
      const result: StreamRecordsResponse[] = [];
      const [input, output] = streamKeeper<StreamRecordsRequest, StreamRecordsResponse>(
        this.client.streamRecords.bind(this.client),
        [new IndexFixer('recordIndex')],
      );
      for (const record of records) {
        input.write({ record } as IngestRecordRequest);
      }
      if (records && records.length) {
        input.end();
      }
      output.on('data', (newChunk) => {
        result.push(newChunk);
      });
      output.on('error', (error) => {
        reject(error);
      });
      output.on('end', () => {
        resolve(result);
      });
    });
  }

  /**
   * @since 0.7.5
   * @example
   * await sdk.batchUpsertNodes([
   *   {
   *       externalId: 'person1',
   *       type: 'Person',
   *       properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     },
   *    {
   *       externalId: 'person2',
   *       type: 'Person',
   *       properties: [{
   *         type: "email",
   *         value: 'person@yahoo.com',
   *       }],
   *     },
   *     {
   *       externalId: 'person3',
   *       type: 'Person',
   *       properties: [{
   *         type: "customProp",
   *         externalValue: {resolver: {id: "gid:ioidcnvoej"}},
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     }
   * ]);
   */
  batchUpsertNodes(nodes: IngestNodeRecord[]): Promise<BatchUpsertNodesResponse> {
    const r = new BatchUpsertNodes(nodes);
    const req: BatchUpsertNodesRequest = r.marshal();
    return new Promise((resolve, reject) => {
      this.client.batchUpsertNodes(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.5
   * @example
   * await sdk.batchUpsertRelationships([
   *   {
   *       source: {externalId:'person1', type: 'Person'},
   *       target: {externalId:'car1', type: 'Car'},
   *       type: 'OWNS',
   *       properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     },
   *    {
   *       source: {externalId:'person2', type: 'Person'},
   *       target: {externalId:'car2', type: 'Car'},
   *       type: 'OWNS',
   *       properties: [{
   *         type: "licence",
   *         value: '4712589',
   *       }],
   *     }
   * ]);
   */
  batchUpsertRelationships(
    relationships: IngestRelationship[],
  ): Promise<BatchUpsertRelationshipsResponse> {
    const r = new BatchUpsertRelationships(relationships);
    const req: BatchUpsertRelationshipsRequest = r.marshal();
    return new Promise((resolve, reject) => {
      this.client.batchUpsertRelationships(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.5
   * @example
   * await sdk.batchDeleteNodes([
   *   {
   *       externalId: 'person1',
   *       type: 'Person',
   *     },
   *    {
   *       externalId: 'person2',
   *       type: 'Person',
   *     }
   * ]);
   */
  batchDeleteNodes(nodes: IngestNodeMatch[]): Promise<BatchDeleteNodesResponse> {
    const r = new BatchDeleteNodes(nodes);
    const req: BatchDeleteNodesRequest = r.marshal();
    return new Promise((resolve, reject) => {
      this.client.batchDeleteNodes(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.5
   * @example
   * await sdk.batchDeleteNodeProperties([
   *   {
   *       match: {
   *        externalId: 'person1',
   *        type: 'Person',
   *      },
   *      propertyType: 'PropertyType'
   *     },
   *   {
   *       match: {
   *        externalId: 'person2',
   *        type: 'Person',
   *      },
   *      propertyType: 'PropertyType'
   *     }
   * ]);
   */
  batchDeleteNodeProperties(
    nodeProperties: IngestNodePropertyMatch[],
  ): Promise<BatchDeleteNodePropertiesResponse> {
    const r = new BatchDeleteNodeProperties(nodeProperties);
    const req: BatchDeleteNodePropertiesRequest = r.marshal();
    return new Promise((resolve, reject) => {
      this.client.batchDeleteNodeProperties(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.5
   * @example
   * await sdk.batchDeleteRelationships([
   *   {
   *       source: {externalId:'person1', type: 'Person'},
   *       target: {externalId:'car1', type: 'Car'},
   *       type: 'OWNS',
   *       properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     },
   *    {
   *       source: {externalId:'person2', type: 'Person'},
   *       target: {externalId:'car2', type: 'Car'},
   *       type: 'OWNS',
   *       properties: [{
   *         type: "licence",
   *         value: '4712589',
   *       }],
   *     }
   * ]);
   */
  batchDeleteRelationships(
    relationships: IngestRelationship[],
  ): Promise<BatchDeleteRelationshipsResponse> {
    const r = new BatchDeleteRelationships(relationships);
    const req: BatchDeleteRelationshipsRequest = r.marshal();
    return new Promise((resolve, reject) => {
      this.client.batchDeleteRelationships(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.7.5
   * @example
   * await sdk.batchDeleteRelationshipProperties([
   *   {
   *       source: {externalId:'person1', type: 'Person'},
   *       target: {externalId:'car1', type: 'Car'},
   *       type: 'OWNS',
   *       propertyType:'custom'
   *    },
   *    {
   *       source: {externalId:'person2', type: 'Person'},
   *       target: {externalId:'car2', type: 'Car'},
   *       type: 'OWNS',
   *       propertyType:'custom2'
   *    }
   * ]);
   */
  batchDeleteRelationshipProperties(
    relationshipProperties: IngestRelationshipProperty[],
  ): Promise<BatchDeleteRelationshipPropertiesResponse> {
    const r = new BatchDeleteRelationshipProperties(relationshipProperties);
    const req: BatchDeleteRelationshipPropertiesRequest = r.marshal();
    return new Promise((resolve, reject) => {
      this.client.batchDeleteRelationshipProperties(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }
}
