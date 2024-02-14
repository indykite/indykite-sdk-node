import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { SdkClient } from './client/client';
import { IdentityKnowledgeAPIClient as IdentityKnowledgeReadAPIClient } from '../grpc/indykite/knowledge/v1beta2/identity_knowledge_api.grpc-client';
import { Return } from '../grpc/indykite/knowledge/v1beta2/model';
import { Node, Property } from '../grpc/indykite/knowledge/objects/v1beta1/ikg';
import { Value } from '../grpc/indykite/objects/v1beta2/value';
import {
  IdentityKnowledgeReadRequest,
  IdentityKnowledgeReadResponse,
} from '../grpc/indykite/knowledge/v1beta2/identity_knowledge_api';
import { Utils } from './utils/utils';
import { IngestRecord } from './ingest';
import { v4 } from 'uuid';

export const NODE_TYPE = {
  DIGITAL_TWIN: 'DigitalTwin',
  RESOURCE: 'Resource',
};

export interface Identifier {
  externalId: string;
  type: string;
}

export class IdentityKnowledgeClient {
  private client: IdentityKnowledgeReadAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as IdentityKnowledgeReadAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<IdentityKnowledgeClient> {
    return new Promise<IdentityKnowledgeClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(IdentityKnowledgeReadAPIClient, appCredential)
        .then((sdk) => {
          resolve(new IdentityKnowledgeClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   *
   * @since 0.6.0
   * @example
   *  const dt = await sdk.identityKnowledgeRead(
   *    {
   *      query = "MATCH (n:Resource) WHERE n.external_id = $external_id"
   *      input_params = {"external_id": "CJnoXYgnPNDAiMg"}
   *      returns =  [({"variable":"n", "properties":[]})]
   *    } as IdentityKnowledgeReadRequest
   *  )
   */
  identityKnowledgeRead(
    input: IdentityKnowledgeReadRequest,
  ): Promise<IdentityKnowledgeReadResponse> {
    return new Promise((resolve, reject) => {
      this.client.identityKnowledgeRead(input, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(IdentityKnowledgeClient.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * @since 0.6.0
   */
  private parseSingleNodeFromNodes(nodes: Node[]): Node {
    if (!nodes?.length || !nodes[0]) {
      throw new SdkError(
        SdkErrorCode.SDK_CODE_3,
        SkdErrorText.SDK_CODE_3(IdentityKnowledgeClient.name),
      );
    }
    return nodes[0];
  }

  /**
   * Read sends a READ operation to the Identity Knowledge API, with the desired query and input params
   * @since 0.6.0
   */
  read(
    query: string,
    inputParams: { [key: string]: Value },
    returns: Return[],
  ): Promise<IdentityKnowledgeReadResponse> {
    const request: IdentityKnowledgeReadRequest = {
      query,
      inputParams,
      returns,
    } as IdentityKnowledgeReadRequest;
    return this.identityKnowledgeRead(request);
  }

  /**
   * GetIdentityByID is a helper function that queries for an Identity node by its id.
   * @since 0.6.0
   */
  getIdentityByID(id: string): Promise<Node> {
    return this.getNodeByID(id, true);
  }

  /**
   * GetIdentityByIdentifier is a helper function that queries for an Identity node
   * by its externalID + type combination.
   * @since 0.6.0
   */
  getIdentityByIdentifier(identifier: Identifier): Promise<Node> {
    return this.getNodeByIdentifier(identifier, true);
  }

  /**
   * @since 0.6.0
   */
  getNodeByID(id: string, isIdentity?: boolean): Promise<Node> {
    const request: IdentityKnowledgeReadRequest = {
      query: isIdentity
        ? `MATCH (n:DigitalTwin) WHERE n.id = $id`
        : `MATCH (n:Resource) WHERE n.id = $id`,
      inputParams: {
        id: Value.fromJson(Utils.objectToJsonValue(id)),
      },
      returns: [{ variable: 'n', properties: [] }],
    } as IdentityKnowledgeReadRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledgeRead(request)
        .then((response) => resolve(this.parseSingleNodeFromNodes(response.nodes)))
        .catch((error) => reject(error));
    });
  }

  /**
   * @since 0.6.0
   */
  getNodeByIdentifier(identifier: Identifier, isIdentity?: boolean): Promise<Node> {
    const request: IdentityKnowledgeReadRequest = {
      query: isIdentity
        ? `MATCH (n:DigitalTwin) WHERE n.external_id = $externalId AND n.type = $type`
        : `MATCH (n:Resource) WHERE n.external_id = $externalId AND n.type = $type`,
      inputParams: {
        externalId: Value.fromJson(Utils.objectToJsonValue(identifier.externalId)),
        type: Value.fromJson(Utils.objectToJsonValue(identifier.type)),
      },
      returns: [{ variable: 'n', properties: [] }],
    } as IdentityKnowledgeReadRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledgeRead(request)
        .then((response) => resolve(this.parseSingleNodeFromNodes(response.nodes)))
        .catch((error) => reject(error));
    });
  }

  /**
   * ListIdentitiesByProperty is a helper function that lists all Identity nodes
   * that have the specified property.
   * @since 0.6.0
   */
  listIdentitiesByProperty(property: Property): Promise<Node[]> {
    return this.listNodesByProperty(property, true);
  }

  /**
   * ListIdentities is a helper function that lists all Identity nodes.
   * @since 0.6.0
   */
  listIdentities(): Promise<Node[]> {
    return this.listNodes('DigitalTwin');
  }

  /**
   * ListNodes is a helper function that lists all nodes by type, regardless of whether they are Identities
   * or Resources. The nodeType argument should be in PascalCase.
   */
  listNodes(nodeType: string): Promise<Node[]> {
    const request: IdentityKnowledgeReadRequest = {
      query: `MATCH (n:${nodeType})`,
      inputParams: {},
      returns: [{ variable: 'n', properties: [] }],
    } as IdentityKnowledgeReadRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledgeRead(request)
        .then((response) =>
          resolve(
            response.nodes.reduce(
              (acc, node) => (node ? acc.concat(response.nodes) : acc),
              [] as Node[],
            ),
          ),
        )
        .catch((error) => reject(error));
    });
  }

  /**
   * ListNodesByProperty is a helper function that lists all nodes that have the specified type and property.
   * @since 0.6.0
   */
  listNodesByProperty(property: Property, isIdentity?: boolean): Promise<Node[]> {
    const request: IdentityKnowledgeReadRequest = {
      query: isIdentity
        ? `MATCH (n:DigitalTwin)-[:HAS]->(p:Property) WHERE p.type = "${property.type}" and p.value = $${property.type}`
        : `MATCH (n:Resource)-[:HAS]->(p:Property) WHERE p.type = "${property.type}" and p.value = $${property.type}`,
      inputParams: {
        [property.type]: property.value,
      },
      returns: [{ variable: 'n', properties: [] }],
    } as IdentityKnowledgeReadRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledgeRead(request)
        .then((response) =>
          resolve(
            response.nodes.reduce(
              (acc, node) => (node ? acc.concat(response.nodes) : acc),
              [] as Node[],
            ),
          ),
        )
        .catch((error) => reject(error));
    });
  }

  /**
   * delete all nodes of defined type
   */
  async deleteAllWithNodeType(nodeType: string) {
    const request: IdentityKnowledgeReadRequest = {
      query: `MATCH (n:${nodeType})`,
      inputParams: {},
      returns: [{ variable: 'n' }],
    } as IdentityKnowledgeReadRequest;
    const response = await this.identityKnowledgeRead(request);

    let records: IngestRecord[] = [];
    if (response.nodes.length > 0) {
      const nodes: Node[] = response.nodes;
      records = nodes.map((node) => {
        return IngestRecord.delete(Utils.uuidToBase64(v4())).node({
          externalId: node.externalId,
          type: node.type,
        });
      });
      return records;
    }
    return records;
  }
}
