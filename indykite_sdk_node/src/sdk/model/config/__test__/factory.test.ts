import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import { SdkError, SkdErrorText, SdkErrorCode } from '../../../error';
import { Utils } from '../../../utils/utils';
import { ConfigNode } from '../config_node';
import { ConfigNodeFactory } from '../factory';

describe('createInstance', () => {
  describe('when the config is not present', () => {
    let caughtError: SdkError;

    beforeEach(() => {
      try {
        ConfigNodeFactory.createInstance({
          displayName: 'Instance Name',
          description: StringValue.fromJson('Instance description'),
          etag: 'etag-token',
          id: 'instance-id',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          name: 'instance-name',
          config: {
            oneofKind: undefined,
          },
          version: '1',
          tenantId: '',
        });
      } catch (err) {
        caughtError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(caughtError.code).toBe(SdkErrorCode.SDK_CODE_2);
      expect(caughtError.message).toBe(SkdErrorText.SDK_CODE_2(ConfigNode.name, undefined));
    });
  });
});
