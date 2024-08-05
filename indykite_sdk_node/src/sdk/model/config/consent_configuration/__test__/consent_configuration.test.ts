import { ExternalTokenStatus } from '../../../../../grpc/indykite/config/v1beta1/model';
import { ConsentNode } from '../consent_configuration';

describe('when the instance is created', () => {
  let client: ConsentNode;

  beforeEach(() => {
    client = new ConsentNode({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: { value: 'Instance description' },
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
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
    expect(client.purpose).toBe('Purpose');
    expect(client.applicationId).toBe('gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck');
    expect(client.validityPeriod).toBe('86400');
    expect(client.revokeAfterUse).toBe(false);
    expect(client.tokenStatus).toBe(ExternalTokenStatus.DISALLOW);
  });
});
