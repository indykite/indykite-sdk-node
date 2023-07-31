import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { Tenant } from '../tenant';

describe('deserialize', () => {
  describe('when the response contains a tenant', () => {
    let tenant: Tenant;

    beforeEach(() => {
      tenant = Tenant.deserialize({
        tenant: {
          id: 'tenant-id',
          displayName: 'Display Name',
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          issuerId: 'issuer-id',
          etag: 'etag',
          name: 'tenant-name',
          description: StringValue.create({ value: 'Lorem ipsum' }),
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 18)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 19)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 20)),
          default: false,
        },
      });
    });

    it('creates a correct customer instance', () => {
      expect(tenant.displayName).toBe('Display Name');
      expect(tenant.etag).toBe('etag');
      expect(tenant.id).toBe('tenant-id');
      expect(tenant.customerId).toBe('customer-id');
      expect(tenant.appSpaceId).toBe('app-space-id');
      expect(tenant.issuerId).toBe('issuer-id');
      expect(tenant.name).toBe('tenant-name');
      expect(tenant.description).toBe('Lorem ipsum');
      expect(tenant.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(tenant.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(tenant.deleteTime?.toString()).toBe(new Date(2022, 2, 17, 12, 19).toString());
      expect(tenant.destroyTime?.toString()).toBe(new Date(2022, 2, 17, 12, 20).toString());
    });
  });

  describe('when the response does not contain a tenant', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        Tenant.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize tenant");
    });
  });
});
