import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  CheckOAuth2ConsentChallengeRequest,
  CheckOAuth2ConsentChallengeResponse,
  CreateOAuth2ConsentVerifierRequest,
  CreateOAuth2ConsentVerifierResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import * as sdkTypes from '../../model';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ConsentChallengeAudience } from '../../model';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { JsonObject } from '@protobuf-ts/runtime';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';

let sdk: IdentityClient;

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Consent', () => {
  it('check consent challenge', () => {
    const challengeToken = 'challenge_token';
    const clientId = generateRandomGID();
    const scopes = [{ name: 'openid', description: '', displayName: '', required: false }];
    const requestUrl = 'http://www.example.com/oauth';
    const audiences = [] as ConsentChallengeAudience[];
    const appSpaceId = generateRandomGID();
    const acrs = [] as string[];
    const subject = 'Subject';
    const skip = false;
    const mockResp = CheckOAuth2ConsentChallengeResponse.fromJson({
      acrs,
      appSpaceId,
      clientId,
      audiences: audiences as unknown as JsonObject[],
      scopes,
      requestUrl,
      skip,
      subjectIdentifier: subject,
    });
    const clbs = [
      {
        svcerr: null,
        err: null,
        res: mockResp,
        expected: new sdkTypes.ConsentChallenge(
          challengeToken,
          clientId,
          scopes,
          requestUrl,
          audiences,
          appSpaceId,
          acrs,
          subject,
          skip,
        ),
      },
      {
        svcerr: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {} as CheckOAuth2ConsentChallengeResponse,
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: CheckOAuth2ConsentChallengeRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: CheckOAuth2ConsentChallengeResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'checkOAuth2ConsentChallenge').mockImplementation(mockFunc);

      const resp = sdk.checkConsentChallenge(challengeToken);
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toEqual(clb.expected);
      else expect(resp).rejects.toEqual(clb.err);
    });
  });

  it('check consent challenge - no response', () => {
    const challengeToken = 'challenge_token';

    const mockFunc = jest.fn(
      (
        request: CheckOAuth2ConsentChallengeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: CheckOAuth2ConsentChallengeResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, undefined);
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'checkOAuth2ConsentChallenge').mockImplementation(mockFunc);

    const resp = sdk.checkConsentChallenge(challengeToken);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty('message', 'Missing check consent challenge response');
  });

  it('create consent verifier', () => {
    const challengeToken = 'challenge_token';
    const consentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      generateRandomGID(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      generateRandomGID(),
      [],
      'Subject',
      false,
    );
    const deniedConsentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      generateRandomGID(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      generateRandomGID(),
      [],
      'Subject',
      false,
    );
    deniedConsentChallenge.deny({
      error: 'access_denied',
      errorDescription: 'the reason why is the access denied',
      errorHint: '',
      statusCode: 403,
    });
    const mockResp = CreateOAuth2ConsentVerifierResponse.fromJson({
      verifier: 'verifier_token',
      authorizationEndpoint: 'http://www.auth.com',
    });
    const clbs = [
      {
        svcerr: null,
        err: null,
        res: mockResp,
        expected: {
          verifier: 'verifier_token',
          authorizationEndpoint: 'http://www.auth.com',
        },
      },
      {
        svcerr: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {} as CreateOAuth2ConsentVerifierResponse,
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: CreateOAuth2ConsentVerifierRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: CreateOAuth2ConsentVerifierResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'createOAuth2ConsentVerifier').mockImplementation(mockFunc);

      const resp = sdk.createConsentVerifier(consentChallenge);
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toEqual(clb.expected);
      else expect(resp).rejects.toEqual(clb.err);

      const deniedResp = sdk.createConsentVerifier(deniedConsentChallenge);
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(deniedResp).resolves.toEqual(clb.expected);
      else expect(deniedResp).rejects.toEqual(clb.err);
    });
  });

  it('create consent verifier - no response', () => {
    const challengeToken = 'challenge_token';
    const consentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      generateRandomGID(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      generateRandomGID(),
      [],
      'Subject',
      false,
    );
    const deniedConsentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      generateRandomGID(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      generateRandomGID(),
      [],
      'Subject',
      false,
    );
    deniedConsentChallenge.deny({
      error: 'access_denied',
      errorDescription: 'the reason why is the access denied',
      errorHint: '',
      statusCode: 403,
    });

    const mockFunc = jest.fn(
      (
        request: CreateOAuth2ConsentVerifierRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: CreateOAuth2ConsentVerifierResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null);
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'createOAuth2ConsentVerifier').mockImplementation(mockFunc);

    const resp = sdk.createConsentVerifier(consentChallenge);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty('message', 'Missing approved consent verifier response');

    const deniedResp = sdk.createConsentVerifier(deniedConsentChallenge);
    expect(mockFunc).toBeCalled();
    expect(deniedResp).rejects.toHaveProperty(
      'message',
      'Missing denied consent verifier response',
    );
  });
});
