import { SdkError, SdkErrorCode } from '../../error';
import { ApplicationSpace } from '../application_space';

describe('deserialize', () => {
  describe('when the response contains an application space', () => {
    let appSpace: ApplicationSpace;

    beforeEach(() => {
      appSpace = ApplicationSpace.deserialize({
        appSpace: {
          customerId: 'customer-id',
          displayName: 'Display Name',
          etag: 'etag',
          id: 'app-space-id',
          issuerId: 'issuer-id',
          name: 'app-space-name',
          description: 'Lorem ipsum',
          createTime: new Date(2022, 2, 17, 12, 17),
          updateTime: new Date(2022, 2, 17, 12, 18),
          deleteTime: new Date(2022, 2, 17, 12, 19),
          destroyTime: new Date(2022, 2, 17, 12, 20),
        },
      });
    });

    it('creates a correct application space instance', () => {
      expect(appSpace.customerId).toBe('customer-id');
      expect(appSpace.displayName).toBe('Display Name');
      expect(appSpace.etag).toBe('etag');
      expect(appSpace.id).toBe('app-space-id');
      expect(appSpace.issuerId).toBe('issuer-id');
      expect(appSpace.name).toBe('app-space-name');
      expect(appSpace.description).toBe('Lorem ipsum');
      expect(appSpace.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(appSpace.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(appSpace.deleteTime?.toString()).toBe(new Date(2022, 2, 17, 12, 19).toString());
      expect(appSpace.destroyTime?.toString()).toBe(new Date(2022, 2, 17, 12, 20).toString());
    });
  });

  describe('when the response does not contain an application space', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        ApplicationSpace.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize application space");
    });
  });
});
