import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { Application } from '../application';

describe('deserialize', () => {
  describe('when the response contains a application', () => {
    let application: Application;

    beforeEach(() => {
      application = Application.deserialize({
        application: {
          id: 'application-id',
          displayName: 'Display Name',
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          etag: 'etag',
          name: 'application-name',
          description: StringValue.create({ value: 'Lorem ipsum' }),
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 18)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 19)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 20)),
        },
      });
    });

    it('creates a correct customer instance', () => {
      expect(application.displayName).toBe('Display Name');
      expect(application.etag).toBe('etag');
      expect(application.id).toBe('application-id');
      expect(application.customerId).toBe('customer-id');
      expect(application.appSpaceId).toBe('app-space-id');
      expect(application.name).toBe('application-name');
      expect(application.description).toBe('Lorem ipsum');
      expect(application.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(application.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(application.deleteTime?.toString()).toBe(new Date(2022, 2, 17, 12, 19).toString());
      expect(application.destroyTime?.toString()).toBe(new Date(2022, 2, 17, 12, 20).toString());
    });
  });

  describe('when the response does not contain a application', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        Application.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize application");
    });
  });
});
