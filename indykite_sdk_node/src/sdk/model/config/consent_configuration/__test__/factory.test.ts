import { ConsentConfigFactory } from '../factory';
import { ConsentNode } from '../consent_configuration';

describe('createInstance', () => {
  let client: ConsentNode;

  beforeEach(() => {
    client = ConsentConfigFactory.createInstance('instance-name', {
      purpose: 'Purpose',
      dataPoints: ['lastname', 'firstname', 'email'],
      applicationId: 'gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck',
      validityPeriod: '86400',
      revokeAfterUse: false,
    });
  });

  it('creates a correct instance', () => {
    expect(client).toEqual(
      new ConsentNode({
        purpose: 'Purpose',
        dataPoints: ['lastname', 'firstname', 'email'],
        applicationId: 'gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck',
        name: 'instance-name',
        validityPeriod: '86400',
        revokeAfterUse: false,
      }),
    );
  });
});
