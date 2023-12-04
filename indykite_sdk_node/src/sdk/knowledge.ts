import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { SdkClient } from './client/client';
import { IdentityKnowledgeAPIClient } from '../grpc/indykite/knowledge/v1beta1/identity_knowledge_api.grpc-client';
import { Path, Node, Operation, Property } from '../grpc/indykite/knowledge/v1beta1/model';
import {
  IdentityKnowledgeRequest,
  IdentityKnowledgeResponse,
} from '../grpc/indykite/knowledge/v1beta1/identity_knowledge_api';
import { InputParam } from '../grpc/indykite/authorization/v1beta1/model';
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
  private client: IdentityKnowledgeAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as IdentityKnowledgeAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<IdentityKnowledgeClient> {
    return new Promise<IdentityKnowledgeClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(IdentityKnowledgeAPIClient, appCredential)
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
   * @since 0.4.1
   * @example
   *  const dt = await sdk.identityKnowledge(
   *    {
   *      operation: Operation.READ,
   *      path: "(:DigitalTwin)-[:SERVICES]->(n:Truck)",
   *      conditions: "WHERE n.external_id = \"1234\"",
   *    } as IdentityKnowledgeRequest
   *  )
   */
  identityKnowledge(input: IdentityKnowledgeRequest): Promise<IdentityKnowledgeResponse> {
    return new Promise((resolve, reject) => {
      this.client.identityKnowledge(input, (err, response) => {
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
   * @since 0.4.2
   */
  private parseSingleNodeFromPaths(paths: Path[]): Node {
    if (!paths?.length || !paths[0].nodes?.length) {
      throw new SdkError(
        SdkErrorCode.SDK_CODE_3,
        SkdErrorText.SDK_CODE_3(IdentityKnowledgeClient.name),
      );
    }
    return paths[0].nodes[0];
  }

  /**
   * @since 0.4.2
   */
  private parseMultipleNodesFromPaths(paths: Path[]): Node[] {
    if (paths) {
      return paths.reduce(
        (acc, path) => (path?.nodes ? acc.concat(path.nodes) : acc),
        [] as Node[],
      );
    }
    return [];
  }

  /**
   * Read sends a READ operation to the Identity Knowledge API, with the desired path and optional conditions.
   * @since 0.4.2
   */
  read(
    path: string,
    conditions: string,
    inputParams: { [key: string]: InputParam },
  ): Promise<IdentityKnowledgeResponse> {
    const request: IdentityKnowledgeRequest = {
      operation: Operation.READ,
      path,
      conditions,
      inputParams,
    } as IdentityKnowledgeRequest;
    return this.identityKnowledge(request);
  }

  /**
   * GetDigitalTwinByID is a helper function that queries for a DigitalTwin node by its id.
   * @since 0.4.2
   */
  getDigitalTwinByID(id: string): Promise<Node> {
    return this.getNodeByID(id, NODE_TYPE.DIGITAL_TWIN);
  }

  /**
   * GetDigitalTwinByIdentifier is a helper function that queries for a DigitalTwin node
   * by its externalID + type combination.
   * @since 0.4.2
   */
  getDigitalTwinByIdentifier(identifier: Identifier): Promise<Node> {
    return this.getNodeByIdentifier(NODE_TYPE.DIGITAL_TWIN, identifier);
  }

  /**
   * GetResourceByID is a helper function that queries for a Resource node by its id.
   * @since 0.4.2
   */
  getResourceByID(id: string): Promise<Node> {
    return this.getNodeByID(id, NODE_TYPE.RESOURCE);
  }

  /**
   * GetResourceByIdentifier is a helper function that queries for a Resource node
   * by its externalID + type combination.
   * @since 0.4.2
   */
  getResourceByIdentifier(identifier: Identifier): Promise<Node> {
    return this.getNodeByIdentifier(NODE_TYPE.RESOURCE, identifier);
  }

  /**
   * ListDigitalTwinsByProperty is a helper function that lists all DigitalTwin nodes
   * that have the specified property.
   * @since 0.4.2
   */
  listDigitalTwinsByProperty(property: Property): Promise<Node[]> {
    return this.listNodesByProperty(NODE_TYPE.DIGITAL_TWIN, property);
  }

  /**
   * ListResourcesByProperty is a helper function that lists all Resource nodes.
   * that have the specified property.
   * @since 0.4.2
   */
  listResourcesByProperty(property: Property): Promise<Node[]> {
    return this.listNodesByProperty(NODE_TYPE.RESOURCE, property);
  }

  /**
   * ListDigitalTwins is a helper function that lists all DigitalTwin nodes.
   * @since 0.4.2
   */
  listDigitalTwins(): Promise<Node[]> {
    return this.listNodes(NODE_TYPE.DIGITAL_TWIN);
  }

  /**
   * ListResources is a helper function that lists all Resource nodes.
   * that have the specified property.
   * @since 0.4.2
   */
  listResources(): Promise<Node[]> {
    return this.listNodes(NODE_TYPE.RESOURCE);
  }

  /**
   * ListNodes is a helper function that lists all nodes by type, regardless of whether they are DigitalTwins
   * or Resources. The nodeType argument should be in PascalCase.
   */
  listNodes(nodeType: string): Promise<Node[]> {
    const request: IdentityKnowledgeRequest = {
      operation: Operation.READ,
      path: `(:${nodeType})`,
      conditions: '',
      inputParams: {},
    } as IdentityKnowledgeRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledge(request)
        .then((response) => resolve(this.parseMultipleNodesFromPaths(response.paths)))
        .catch((error) => reject(error));
    });
  }

  /**
   * ListNodesByProperty is a helper function that lists all nodes that have the specified type and property.
   * @since 0.4.2
   */
  listNodesByProperty(nodeType: string, property: Property): Promise<Node[]> {
    const request: IdentityKnowledgeRequest = {
      operation: Operation.READ,
      path: `(n:${nodeType})`,
      conditions: `WHERE n.${property.key} = $${property.key}`,
      inputParams: {
        [property.key]: property.value,
      },
    } as IdentityKnowledgeRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledge(request)
        .then((response) => resolve(this.parseMultipleNodesFromPaths(response.paths)))
        .catch((error) => reject(error));
    });
  }

  /**
   * @since 0.4.2
   */
  getNodeByID(id: string, nodeType: string): Promise<Node> {
    const request: IdentityKnowledgeRequest = {
      operation: Operation.READ,
      path: `(n:${nodeType})`,
      conditions: `WHERE n.id = $id`,
      inputParams: {
        id: InputParam.fromJson(Utils.objectToJsonValue(id)),
      },
    } as IdentityKnowledgeRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledge(request)
        .then((response) => resolve(this.parseSingleNodeFromPaths(response.paths)))
        .catch((error) => reject(error));
    });
  }

  /**
   * @since 0.4.2
   */
  getNodeByIdentifier(nodeType: string, identifier: Identifier): Promise<Node> {
    const request: IdentityKnowledgeRequest = {
      operation: Operation.READ,
      path: `(n:${nodeType})`,
      conditions: `WHERE n.external_id = $externalId AND n.type = $type`,
      inputParams: {
        externalId: InputParam.fromJson(Utils.objectToJsonValue(identifier.externalId)),
        type: InputParam.fromJson(Utils.objectToJsonValue(identifier.type)),
      },
    } as IdentityKnowledgeRequest;
    return new Promise((resolve, reject) => {
      this.identityKnowledge(request)
        .then((response) => resolve(this.parseSingleNodeFromPaths(response.paths)))
        .catch((error) => reject(error));
    });
  }

 /**
   * delete all nodes of defined type
   */
 async deleteAllWithNodeType(nodeType: string){
  let nodes: Node[] = await this.listNodes(nodeType);
  let records: IngestRecord[] = [];
  records = nodes.map((node)=>{
    return IngestRecord.delete(Utils.uuidToBase64(v4()),).node({
           externalId: node.externalId,
           type: node.type
        });
  });
 }
}
