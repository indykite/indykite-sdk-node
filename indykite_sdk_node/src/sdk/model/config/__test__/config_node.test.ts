import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  CreateConfigNodeResponse,
  ReadConfigNodeResponse,
} from '../../../../grpc/indykite/config/v1beta1/config_management_api';
import { SdkError, SkdErrorText, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ConfigNode } from '../config_node';

describe('deserialize', () => {
  describe('when the response contains only a CreateConfigNodeResponse', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        ConfigNode.deserialize({
          id: 'config-node-id',
          locationId: 'location-id',
          createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 18)),
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          etag: 'etag',
          bookmark: 'bookmark-name',
        } as CreateConfigNodeResponse);
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('creates a correct customer instance', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(SkdErrorText.SDK_CODE_1(ConfigNode.name));
    });
  });

  describe('when the response contains a ConfigNode + Name, display, description, customerId, spaceId, tenantId', () => {
    let confNode: ConfigNode;

    beforeEach(() => {
      confNode = ConfigNode.deserialize(
        {
          id: 'config-node-id',
        } as CreateConfigNodeResponse & ReadConfigNodeResponse,
        'application-name',
        'Display Name',
        'Lorem ipsum',
        'customer-id',
        'app-space-id',
        'tenant-id',
      );
    });

    it('creates a correct customer instance', () => {
      expect(confNode.id).toBeUndefined();
      expect(confNode.displayName).toBe('Display Name');
      expect(confNode.description?.value).toBe('Lorem ipsum');
      expect(confNode.etag).toBeUndefined();

      expect(confNode.customerId).toBe('customer-id');
      expect(confNode.appSpaceId).toBe('app-space-id');
      expect(confNode.name).toBe('application-name');
      expect(confNode.tenantId).toBe('tenant-id');

      expect(confNode.createTime).toBeUndefined();
      expect(confNode.updateTime).toBeUndefined();
      expect(confNode.createdBy).toBeUndefined();
      expect(confNode.updatedBy).toBeUndefined();
    });
  });

  describe('when the response contains a ConfigNode + Name', () => {
    let confNode: ConfigNode;

    beforeEach(() => {
      confNode = ConfigNode.deserialize(
        {
          configNode: {
            name: 'application-name', //?
            displayName: 'Display Name', //?
            description: StringValue.create({ value: 'Lorem ipsum' }), //?
            customerId: 'customer-id', //?
            appSpaceId: 'app-space-id', //?
            tenantId: 'tenant-id', //?
            id: 'config-node-id',
            // locationId: 'location-id',
            createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
            updateTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 18)),
            createdBy: 'Lorem ipsum - creator',
            updatedBy: 'Lorem ipsum - updater',
            etag: 'etag',
            // bookmark: 'bookmark-name',
          },
        } as CreateConfigNodeResponse & ReadConfigNodeResponse,
        'name',
      );
    });

    it('creates a correct customer instance', () => {
      expect(confNode.id).toBe('config-node-id');
      expect(confNode.displayName).toBe('Display Name');
      expect(confNode.description?.value).toBe('Lorem ipsum');
      expect(confNode.etag).toBe('etag');

      expect(confNode.customerId).toBe('customer-id');
      expect(confNode.appSpaceId).toBe('app-space-id');
      expect(confNode.name).toBe('application-name');
      expect(confNode.tenantId).toBe('tenant-id');

      expect(confNode.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(confNode.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(confNode.createdBy).toBe('Lorem ipsum - creator');
      expect(confNode.updatedBy).toBe('Lorem ipsum - updater');
    });
  });
});
