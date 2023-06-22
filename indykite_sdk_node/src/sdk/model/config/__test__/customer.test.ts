import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import { SdkError, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { Customer } from '../customer';

describe('deserialize', () => {
  describe('when the response contains a customer', () => {
    let customer: Customer;

    beforeEach(() => {
      customer = Customer.deserialize({
        customer: {
          id: 'customer-id',
          displayName: 'Display Name',
          etag: 'etag',
          name: 'customer-name',
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
      expect(customer.displayName).toBe('Display Name');
      expect(customer.etag).toBe('etag');
      expect(customer.id).toBe('customer-id');
      expect(customer.name).toBe('customer-name');
      expect(customer.description).toBe('Lorem ipsum');
      expect(customer.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(customer.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(customer.deleteTime?.toString()).toBe(new Date(2022, 2, 17, 12, 19).toString());
      expect(customer.destroyTime?.toString()).toBe(new Date(2022, 2, 17, 12, 20).toString());
    });
  });

  describe('when the response does not contain a customer', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        Customer.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize customer");
    });
  });
});
