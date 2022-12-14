import { Utils } from '../../utils/utils';
import { AuthorizationDecisions } from '../authorization_decisions';

describe('when the response does not contain any data', () => {
  let instance: AuthorizationDecisions;

  beforeEach(() => {
    instance = AuthorizationDecisions.deserialize({
      decisions: {},
    });
  });

  it('does not put any data to the instance', () => {
    expect(instance.decisionTime).toBeUndefined();
    expect(instance.resources).toEqual({});
    expect(instance.isAuthorized('unknown', 'unknown')).toBeFalsy();
  });
});

describe('when the response contains some data', () => {
  const decisionTime = new Date();
  let instance: AuthorizationDecisions;

  beforeEach(() => {
    instance = AuthorizationDecisions.deserialize({
      decisions: {
        resource1: {
          allowAction: {
            READ: true,
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(decisionTime),
    });
  });

  it('does not put any data to the instance', () => {
    expect(instance.decisionTime).toEqual(decisionTime);
    expect(instance.resources).toEqual({
      resource1: {
        READ: true,
      },
    });
    expect(instance.isAuthorized('resource1', 'READ')).toBeTruthy();
    expect(instance.isAuthorized('unknown', 'READ')).toBeFalsy();
  });
});
