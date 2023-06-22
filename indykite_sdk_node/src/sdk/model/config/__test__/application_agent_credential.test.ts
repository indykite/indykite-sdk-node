import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ApplicationAgentCredential } from '../application_agent_credential';

describe('deserialize', () => {
  describe('when the response contains an application agent credential', () => {
    let appAgentCredential: ApplicationAgentCredential;

    beforeEach(() => {
      appAgentCredential = ApplicationAgentCredential.deserialize({
        applicationAgentCredential: {
          appSpaceId: 'app-space-id',
          applicationAgentId: 'app-agent-id',
          applicationId: 'application-id',
          customerId: 'customer-id',
          displayName: 'Display Name',
          id: 'app-agent-credential-id',
          kid: 'kid-id',
          createdBy: 'Lorem ipsum - creator',
          createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 19)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 20)),
        },
      });
    });

    it('creates a correct application agent credential instance', () => {
      expect(appAgentCredential.appSpaceId).toBe('app-space-id');
      expect(appAgentCredential.applicationAgentId).toBe('app-agent-id');
      expect(appAgentCredential.applicationId).toBe('application-id');
      expect(appAgentCredential.customerId).toBe('customer-id');
      expect(appAgentCredential.displayName).toBe('Display Name');
      expect(appAgentCredential.id).toBe('app-agent-credential-id');
      expect(appAgentCredential.kid).toBe('kid-id');
      expect(appAgentCredential.createTime?.toString()).toBe(
        new Date(2022, 2, 17, 12, 17).toString(),
      );
      expect(appAgentCredential.deleteTime?.toString()).toBe(
        new Date(2022, 2, 17, 12, 19).toString(),
      );
      expect(appAgentCredential.destroyTime?.toString()).toBe(
        new Date(2022, 2, 17, 12, 20).toString(),
      );
    });
  });

  describe('when it is the creation response', () => {
    let appAgentCredential: ApplicationAgentCredential;

    beforeEach(() => {
      appAgentCredential = ApplicationAgentCredential.deserialize(
        {
          id: 'app-agent-credential-id',
          displayName: 'Display Name',
          kid: 'kid-id',
          applicationAgentId: 'app-agent-id',
          agentConfig: new Uint8Array(
            Buffer.from(
              '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
              'utf-8',
            ),
          ),
          bookmark: 'bookmark-token',
        },
        'Application Agent Credential',
        'app-agent-id',
      );
    });

    it('creates a correct application agent credential instance', () => {
      expect(appAgentCredential.appSpaceId).toBeUndefined();
      expect(appAgentCredential.applicationAgentId).toBe('app-agent-id');
      expect(appAgentCredential.applicationId).toBeUndefined();
      expect(appAgentCredential.customerId).toBeUndefined();
      expect(appAgentCredential.displayName).toBe('Application Agent Credential');
      expect(appAgentCredential.id).toBe('app-agent-credential-id');
      expect(appAgentCredential.kid).toBe('kid-id');
      expect(appAgentCredential.createTime).toBeUndefined();
      expect(appAgentCredential.deleteTime).toBeUndefined();
      expect(appAgentCredential.destroyTime).toBeUndefined();
    });
  });

  describe('when the response does not contain an application agent credential', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        ApplicationAgentCredential.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize application agent credential");
    });
  });
});
