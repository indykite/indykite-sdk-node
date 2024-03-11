import { IdentityKnowledgeAPIClient } from '../../../grpc/indykite/knowledge/v1beta2/identity_knowledge_api.grpc-client';
import { SdkClient } from '../../client/client';
import { IdentityKnowledgeReadClient } from '../../knowledge';
import { applicationTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when a new client is created', () => {
  describe('when no error is thrown', () => {
    let returnedValue: IdentityKnowledgeReadClient;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));

      returnedValue = await IdentityKnowledgeReadClient.createInstance(
        JSON.stringify(applicationTokenMock),
      );
    });

    it('creates a new instance', () => {
      expect(SdkClient.createIdentityInstance).toHaveBeenCalledWith(
        IdentityKnowledgeAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(returnedValue).toBeInstanceOf(IdentityKnowledgeReadClient);
    });
  });

  describe('when an error is thrown', () => {
    const error = new Error('Error mock');
    let caughtError: Error;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.reject(error));
      try {
        await IdentityKnowledgeReadClient.createInstance(JSON.stringify(applicationTokenMock));
      } catch (err) {
        caughtError = err as Error;
      }
    });

    it('throws an error', () => {
      expect(SdkClient.createIdentityInstance).toHaveBeenCalledWith(
        IdentityKnowledgeAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(caughtError).toBe(error);
    });
  });
});
