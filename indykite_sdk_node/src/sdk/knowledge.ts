import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { SdkClient } from './client/client';
import { IdentityKnowledgeAPIClient } from '../grpc/indykite/knowledge/v1beta1/identity_knowledge_api.grpc-client';
import { IdentityKnowledgeRequest, IdentityKnowledgeResponse } from '../grpc/indykite/knowledge/v1beta1/identity_knowledge_api';
import { Operation } from '../grpc/indykite/knowledge/v1beta1/model';

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
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(IdentityKnowledgeClient.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }
  
}