import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { ApplicationAgent } from '../application_agent';

describe('deserialize', () => {
  describe('when the response contains an application agent with description', () => {
    let appAgent: ApplicationAgent;

    beforeEach(() => {
      appAgent = ApplicationAgent.deserialize({
        applicationAgent: {
          appSpaceId: 'app-space-id',
          applicationId: 'application-id',
          customerId: 'customer-id',
          displayName: 'Display Name',
          etag: 'etag',
          id: 'app-agent-id',
          name: 'app-agent-name',
          description: StringValue.create({ value: 'Lorem ipsum' }),
          createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 18)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 19)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 20)),
        },
      });
    });

    it('creates a correct application agent instance', () => {
      expect(appAgent.appSpaceId).toBe('app-space-id');
      expect(appAgent.applicationId).toBe('application-id');
      expect(appAgent.customerId).toBe('customer-id');
      expect(appAgent.displayName).toBe('Display Name');
      expect(appAgent.etag).toBe('etag');
      expect(appAgent.id).toBe('app-agent-id');
      expect(appAgent.name).toBe('app-agent-name');
      expect(appAgent.description).toBe('Lorem ipsum');
      expect(appAgent.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(appAgent.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(appAgent.deleteTime?.toString()).toBe(new Date(2022, 2, 17, 12, 19).toString());
      expect(appAgent.destroyTime?.toString()).toBe(new Date(2022, 2, 17, 12, 20).toString());
    });
  });

  describe('when the response contains an application agent without description', () => {
    let appAgent: ApplicationAgent;

    beforeEach(() => {
      appAgent = ApplicationAgent.deserialize({
        applicationAgent: {
          appSpaceId: 'app-space-id',
          applicationId: 'application-id',
          customerId: 'customer-id',
          displayName: 'Display Name',
          etag: 'etag',
          id: 'app-agent-id',
          name: 'app-agent-name',
          createTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 17)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 18)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 19)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 17, 12, 20)),
        },
      });
    });

    it('creates a correct application agent instance', () => {
      expect(appAgent.appSpaceId).toBe('app-space-id');
      expect(appAgent.applicationId).toBe('application-id');
      expect(appAgent.customerId).toBe('customer-id');
      expect(appAgent.displayName).toBe('Display Name');
      expect(appAgent.etag).toBe('etag');
      expect(appAgent.id).toBe('app-agent-id');
      expect(appAgent.name).toBe('app-agent-name');
      expect(appAgent.description).toBeUndefined();
      expect(appAgent.createTime?.toString()).toBe(new Date(2022, 2, 17, 12, 17).toString());
      expect(appAgent.updateTime?.toString()).toBe(new Date(2022, 2, 17, 12, 18).toString());
      expect(appAgent.deleteTime?.toString()).toBe(new Date(2022, 2, 17, 12, 19).toString());
      expect(appAgent.destroyTime?.toString()).toBe(new Date(2022, 2, 17, 12, 20).toString());
    });
  });

  describe('when it is the creation response', () => {
    let appAgent: ApplicationAgent;

    beforeEach(() => {
      appAgent = ApplicationAgent.deserialize(
        {
          etag: 'etag',
          id: 'app-agent-id',
        },
        'application-id',
        'app-agent-name',
      );
    });

    it('creates a correct application agent instance', () => {
      expect(appAgent.appSpaceId).toBeUndefined();
      expect(appAgent.applicationId).toBe('application-id');
      expect(appAgent.customerId).toBeUndefined();
      expect(appAgent.displayName).toBeUndefined();
      expect(appAgent.etag).toBe('etag');
      expect(appAgent.id).toBe('app-agent-id');
      expect(appAgent.name).toBe('app-agent-name');
      expect(appAgent.description).toBeUndefined();
      expect(appAgent.createTime).toBeUndefined();
      expect(appAgent.updateTime).toBeUndefined();
      expect(appAgent.deleteTime).toBeUndefined();
      expect(appAgent.destroyTime).toBeUndefined();
    });
  });

  describe('when the response does not contain an application agent', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        ApplicationAgent.deserialize({});
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize application agent");
    });
  });
});
