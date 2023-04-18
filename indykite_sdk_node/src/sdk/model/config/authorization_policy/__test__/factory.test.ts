import { AuthorizationPolicyFactory } from '../factory';
import { AuthorizationPolicy, AuthorizationPolicyConfig_Status } from '../authorization_policy';

describe('createInstance', () => {
  const tags: string[] = [];
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
    client = AuthorizationPolicyFactory.createInstance('instance-name', {
      policy,
      status: AuthorizationPolicyConfig_Status.ACTIVE,
      tags,
    });
  });

  it('creates a correct instance', () => {
    expect(client).toEqual(
      new AuthorizationPolicy({
        policy,
        tags,
        status: AuthorizationPolicyConfig_Status.ACTIVE,
        name: 'instance-name',
      }),
    );
  });
});
