import { ExternalTokenStatus } from '../../../../../grpc/indykite/config/v1beta1/model';
import { ConsentConfigFactory } from '../factory';
import { ConsentNode } from '../consent_configuration';

describe('createInstance', () => {
  let client: ConsentNode;

  beforeEach(() => {
    client = ConsentConfigFactory.createInstance('instance-name', {
      purpose: 'Purpose',
      dataPoints: [
        '"query": "", "returns": [ { "variable": "", ' +
          '"properties": ["name", "email", "location"]}',
      ],
      applicationId: 'gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck',
      validityPeriod: '86400',
      revokeAfterUse: false,
      tokenStatus: ExternalTokenStatus.DISALLOW,
    });
  });

  it('creates a correct instance', () => {
    expect(client).toEqual(
      new ConsentNode({
        purpose: 'Purpose',
        dataPoints: [
          '"query": "", "returns": [ { "variable": "", ' +
            '"properties": ["name", "email", "location"]}',
        ],
        applicationId: 'gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck',
        name: 'instance-name',
        validityPeriod: '86400',
        revokeAfterUse: false,
        tokenStatus: ExternalTokenStatus.DISALLOW,
      }),
    );
  });
});
