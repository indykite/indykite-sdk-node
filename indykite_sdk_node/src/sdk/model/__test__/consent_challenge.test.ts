import { v4 } from 'uuid';
import { ConsentChallengeAudience } from '..';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { ConsentChallenge } from '../consent_challenge';

describe('properties', () => {
  const challengeToken = 'challenge_token';
  const clientId = v4();
  const scopes = [{ name: 'openid', description: '', displayName: '', required: false }];
  const requestUrl = 'http://www.example.com/oauth';
  const audiences = [] as ConsentChallengeAudience[];
  const appSpace = v4();
  const acrs = [] as string[];
  const subject = 'Subject';
  const skip = false;
  let challengeInstance: ConsentChallenge;

  beforeEach(() => {
    challengeInstance = new ConsentChallenge(
      challengeToken,
      clientId,
      scopes,
      requestUrl,
      audiences,
      appSpace,
      acrs,
      subject,
      skip,
    );
  });

  it('initialization', () => {
    expect(challengeInstance.challenge).toEqual(challengeToken);
    expect(challengeInstance.clientId).toEqual(clientId);
    expect(challengeInstance.scopes).toEqual(scopes);
    expect(challengeInstance.requestUrl).toEqual(requestUrl);
    expect(challengeInstance.audiences).toEqual(audiences);
    expect(challengeInstance.appSpaceId).toEqual(appSpace);
    expect(challengeInstance.acrs).toEqual(acrs);
    expect(challengeInstance.subjectIdentifier).toEqual(subject);
    expect(challengeInstance.skip).toEqual(skip);
    expect(challengeInstance.getApprovedScopeNames()).toEqual([]);
    expect(challengeInstance.isDenied()).toEqual(false);
    expect(challengeInstance.getDenialReason()).toEqual(null);
    expect(challengeInstance.isDenied()).toEqual(false);
  });

  describe('approve scopes', () => {
    beforeEach(() => {
      challengeInstance.approveScopes(['openid']);
    });

    it('adds approved scopes', () => {
      expect(challengeInstance.getApprovedScopeNames()).toEqual(['openid']);
    });
  });

  describe('remember scopes', () => {
    beforeEach(() => {
      challengeInstance.setRemember(true);
      challengeInstance.setRememberFor('5');
      challengeInstance.setSession({
        accessToken: {
          fields: { answer: { value: { oneofKind: 'doubleValue', doubleValue: 42 } } },
        },
      });
    });

    it('adds approved scopes', () => {
      expect(challengeInstance.getRemember()).toEqual(true);
      expect(challengeInstance.getRememberFor()).toEqual('5');
      expect(challengeInstance.getSession()?.accessToken?.fields?.answer?.value?.oneofKind).toEqual(
        'doubleValue',
      );
    });
  });

  describe("doesn't approve unknown scopes", () => {
    let error: unknown;

    beforeEach(() => {
      try {
        challengeInstance.approveScopes(['undefinedScope']);
      } catch (err) {
        error = err;
      }
    });

    it('throws an error', () => {
      expect(error).toBeDefined();
      expect(challengeInstance.getApprovedScopeNames()).toEqual([]);
    });
  });

  describe("doesn't approve duplicite scopes", () => {
    beforeEach(() => {
      challengeInstance.approveScopes(['openid', 'openid']);
    });

    it('throws an error', () => {
      expect(challengeInstance.getApprovedScopeNames()).toEqual(['openid']);
    });
  });

  describe('deny challenge', () => {
    const denialReason = {
      error: 'access_denied',
      errorDescription: 'Error description',
      errorHint: '',
      statusCode: 400,
    };

    beforeEach(() => {
      challengeInstance.deny(denialReason);
    });

    it('denies challenge', () => {
      expect(challengeInstance.isDenied()).toEqual(true);
      expect(challengeInstance.getDenialReason()).toEqual(denialReason);
    });
  });
});

describe('deserialization', () => {
  const challengeToken = 'challenge_token';
  const clientId = v4();
  const scopes = [{ name: 'openid', description: '', displayName: '', required: false }];
  const requestUrl = 'http://www.example.com/oauth';
  const audiences = [] as ConsentChallengeAudience[];
  const appSpace = v4();
  const acrs = [] as string[];
  const subject = 'Subject';
  const skip = false;
  let challengeInstance: ConsentChallenge;

  beforeEach(() => {
    challengeInstance = ConsentChallenge.deserialize(
      {
        acrs,
        appSpaceId: appSpace,
        clientId,
        audiences,
        scopes,
        requestUrl,
        skip,
        subjectIdentifier: subject,
        digitalTwin: {
          id: v4(),
          kind: DigitalTwinKind.PERSON,
          state: DigitalTwinState.ACTIVE,
          tenantId: v4(),
          tags: [],
        },
      },
      challengeToken,
    );
  });

  it('initialization', () => {
    expect(challengeInstance.challenge).toEqual(challengeToken);
    expect(challengeInstance.clientId).toEqual(clientId);
    expect(challengeInstance.scopes).toEqual(scopes);
    expect(challengeInstance.requestUrl).toEqual(requestUrl);
    expect(challengeInstance.audiences).toEqual(audiences);
    expect(challengeInstance.appSpaceId).toEqual(appSpace);
    expect(challengeInstance.acrs).toEqual(acrs);
    expect(challengeInstance.subjectIdentifier).toEqual(subject);
    expect(challengeInstance.skip).toEqual(skip);
    expect(challengeInstance.getApprovedScopeNames()).toEqual([]);
    expect(challengeInstance.isDenied()).toEqual(false);
    expect(challengeInstance.getDenialReason()).toEqual(null);
  });

  describe('when an audience is approved', () => {
    beforeEach(() => {
      challengeInstance.approveAudience('audience1');
    });

    it('stores the audience name', () => {
      expect(challengeInstance.getApprovedAudiences()).toEqual(['audience1']);
    });
  });
});
