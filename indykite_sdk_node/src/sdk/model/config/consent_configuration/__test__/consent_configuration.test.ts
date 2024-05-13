import { ConsentNode } from '../consent_configuration';

describe('when the instance is created', () => {
  let client: ConsentNode;

  beforeEach(() => {
    client = new ConsentNode({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: { value: 'Instance description' },
      purpose: 'Purpose',
      dataPoints: ['lastname', 'firstname', 'email'],
      applicationId: 'gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck',
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
    expect(client.purpose).toBe('Purpose');
    expect(client.applicationId).toBe('gid:AAAAFTYjY2yhCkjdo0IfPre0-Ck');
  });
});
