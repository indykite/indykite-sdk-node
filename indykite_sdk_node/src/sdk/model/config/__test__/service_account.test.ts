import { SdkError, SdkErrorCode } from '../../../error';
import { ServiceAccount } from '../service_account';
import { Utils } from '../../../utils/utils';

describe('deserialize', () => {
  describe('when there is a read response with the description', () => {
    let serviceAccount: ServiceAccount;

    beforeEach(() => {
      serviceAccount = ServiceAccount.deserialize({
        serviceAccount: {
          id: 'service-account-id',
          name: 'service-account-name',
          etag: 'etag-token',
          displayName: 'Service Account Name',
          description: { value: 'Description' },
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
        },
      });
    });

    it('creates a correct service account instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
      });
    });
  });

  describe('when there is a read response without the description', () => {
    let serviceAccount: ServiceAccount;

    beforeEach(() => {
      serviceAccount = ServiceAccount.deserialize({
        serviceAccount: {
          id: 'service-account-id',
          name: 'service-account-name',
          etag: 'etag-token',
          displayName: 'Service Account Name',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
        },
      });
    });

    it('creates a correct service account instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
      });
    });
  });

  describe('when the creation response contains all values', () => {
    let serviceAccount: ServiceAccount;

    beforeEach(() => {
      serviceAccount = ServiceAccount.deserialize(
        {
          id: 'service-account-id',
          etag: 'etag-token',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          bookmark: 'bookmark-token',
        },
        'service-account-name',
        'Service Account Name',
        'Description',
      );
    });

    it('creates a correct service account instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
      });
    });
  });

  describe('when the creation response contains required values only', () => {
    let serviceAccount: ServiceAccount;

    beforeEach(() => {
      serviceAccount = ServiceAccount.deserialize(
        {
          id: 'service-account-id',
          etag: 'etag-token',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          bookmark: 'bookmark-token',
        },
        'service-account-name',
      );
    });

    it('creates a correct service account instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
      });
    });
  });

  describe('when name is undefined with the creation response', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        ServiceAccount.deserialize(
          {
            id: 'service-account-id',
            etag: 'etag-token',
            createdBy: 'Lorem ipsum - creator',
            updatedBy: 'Lorem ipsum - updater',
            createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
            updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
            bookmark: 'bookmark-token',
          },
          undefined as unknown as string,
        );
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize service account");
    });
  });
});

describe('construct with the object argument', () => {
  describe('when the response contains all values', () => {
    let serviceAccount: ServiceAccount;

    beforeEach(() => {
      serviceAccount = new ServiceAccount({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        description: 'Description',
      });
    });

    it('creates a correct oauth2 provider instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
      });
    });
  });
});
