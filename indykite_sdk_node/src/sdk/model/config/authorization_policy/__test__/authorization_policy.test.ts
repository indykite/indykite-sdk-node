import { AuthorizationPolicy, AuthorizationPolicyConfig_Status } from '../authorization_policy';

describe('when the instance is created', () => {
  const policy = `
    {
      "path": {
        "subjectId": "50054666",
        "resourceId": "53626256",
        "entities": [
          {
            "id": "53626256",
            "labels": [
              "DigitalTwin"
            ],
            "knowledgeProperties": []
          },
          {
            "id": "50054666",
            "labels": [
              "DigitalTwin"
            ],
            "identityProperties": []
          }
        ],
        "relationships": [
          {
            "source": "50054666",
            "target": "53626256",
            "types": [
              "MOTHER_OF"
            ],
            "nonDirectional": false
          }
        ]
      },
      "actions": [
        "TEST"
      ],
      "active": true
    }
  `;
  let client: AuthorizationPolicy;

  beforeEach(() => {
    client = new AuthorizationPolicy({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: 'Instance description',
      policy,
      status: AuthorizationPolicyConfig_Status.ACTIVE,
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description).toBe('Instance description');
    expect(client.policy).toBe(policy);
    expect(client.status).toBe(AuthorizationPolicyConfig_Status.ACTIVE);
    expect(client.tags).toEqual([]);
  });

  it('marshals correctly', () => {
    expect(client.marshal()).toEqual({
      policy,
      tags: [],
      status: AuthorizationPolicyConfig_Status.ACTIVE,
    });
  });
});
