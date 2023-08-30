import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ServiceAccountCredential } from '../service_account_credential';

describe('deserialize', () => {
  describe('when the response contains an service account credential', () => {
    let serviceAccountCredential: ServiceAccountCredential;

    beforeEach(() => {
      serviceAccountCredential = ServiceAccountCredential.deserialize({
        serviceAccountCredential: {
          appSpaceId: 'app-space-id',
          serviceAccountId: 'service-account-id',
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

    it('creates a correct service account credential instance', () => {
      expect(serviceAccountCredential.appSpaceId).toBe('app-space-id');
      expect(serviceAccountCredential.serviceAccountId).toBe('service-account-id');
      expect(serviceAccountCredential.customerId).toBe('customer-id');
      expect(serviceAccountCredential.displayName).toBe('Display Name');
      expect(serviceAccountCredential.id).toBe('app-agent-credential-id');
      expect(serviceAccountCredential.kid).toBe('kid-id');
      expect(serviceAccountCredential.createTime?.toString()).toBe(
        new Date(2022, 2, 17, 12, 17).toString(),
      );
      expect(serviceAccountCredential.deleteTime?.toString()).toBe(
        new Date(2022, 2, 17, 12, 19).toString(),
      );
      expect(serviceAccountCredential.destroyTime?.toString()).toBe(
        new Date(2022, 2, 17, 12, 20).toString(),
      );
    });
  });

  describe('when it is the creation response', () => {
    let serviceAccountCredential: ServiceAccountCredential;

    beforeEach(() => {
      serviceAccountCredential = ServiceAccountCredential.deserialize(
        {
          id: 'service-account-credential-id',
          kid: 'kid-id',
          serviceAccountId: 'service-account-id',
          serviceAccountConfig: new Uint8Array(
            Buffer.from(
              '{"baseUrl":"https://jarvis-dev.indykite.com" /* SKIPPED REST VALUES */}',
              'utf-8',
            ),
          ),
          bookmark: 'bookmark-token',
          displayName: 'Service Account Credential',
        },
        'Service Account Credential',
        'service-account-id',
      );
    });

    it('creates a correct service account credential instance', () => {
      expect(serviceAccountCredential.appSpaceId).toBeUndefined();
      expect(serviceAccountCredential.serviceAccountId).toBe('service-account-id');
      expect(serviceAccountCredential.customerId).toBeUndefined();
      expect(serviceAccountCredential.displayName).toBe('Service Account Credential');
      expect(serviceAccountCredential.id).toBe('service-account-credential-id');
      expect(serviceAccountCredential.kid).toBe('kid-id');
      expect(serviceAccountCredential.createTime).toBeUndefined();
      expect(serviceAccountCredential.deleteTime).toBeUndefined();
      expect(serviceAccountCredential.destroyTime).toBeUndefined();
    });
  });

  describe('when the response does not contain a service account credential', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        ServiceAccountCredential.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize service account credential");
    });
  });
});
