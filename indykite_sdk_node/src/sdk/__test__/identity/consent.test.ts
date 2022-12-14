import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { v4 } from 'uuid';
import {
  CheckConsentChallengeRequest,
  CheckConsentChallengeResponse,
  CreateConsentVerifierRequest,
  CreateConsentVerifierResponse,
} from '../../../grpc/indykite/identity/v1beta1/identity_management_api';
import { IdentityClient } from '../../identity';
import * as sdkTypes from '../../model';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ConsentChallengeAudience } from '../../model';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { JsonObject } from '@protobuf-ts/runtime';
import { applicationTokenMock } from '../../utils/test_utils';

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
    const clientId = v4();
    const scopes = [{ name: 'openid', description: '', displayName: '', required: false }];
    const requestUrl = 'http://www.example.com/oauth';
    const audiences = [] as ConsentChallengeAudience[];
    const appSpace = v4();
    const acrs = [] as string[];
    const subject = 'Subject';
    const skip = false;
    const mockResp = CheckConsentChallengeResponse.fromJson({
      acrs,
      appSpaceId: Utils.uuidToBase64(appSpace),
      clientId: clientId,
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
          appSpace,
          acrs,
          subject,
          skip,
        ),
      },
      {
        svcerr: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {} as CheckConsentChallengeResponse,
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: CheckConsentChallengeRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: CheckConsentChallengeResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'checkConsentChallenge').mockImplementation(mockFunc);

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
        request: CheckConsentChallengeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: CheckConsentChallengeResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, undefined);
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'checkConsentChallenge').mockImplementation(mockFunc);

    const resp = sdk.checkConsentChallenge(challengeToken);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty('message', 'Missing check consent challenge response');
  });

  it('create consent verifier', () => {
    const challengeToken = 'challenge_token';
    const consentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      v4(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      v4(),
      [],
      'Subject',
      false,
    );
    const deniedConsentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      v4(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      v4(),
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
    const mockResp = CreateConsentVerifierResponse.fromJson({
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
        res: {} as CreateConsentVerifierResponse,
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: CreateConsentVerifierRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: CreateConsentVerifierResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'createConsentVerifier').mockImplementation(mockFunc);

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
      v4(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      v4(),
      [],
      'Subject',
      false,
    );
    const deniedConsentChallenge = new sdkTypes.ConsentChallenge(
      challengeToken,
      v4(),
      [{ name: 'openid', description: '', displayName: '', required: false }],
      'http://www.example.com/oauth',
      [],
      v4(),
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
        request: CreateConsentVerifierRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: CreateConsentVerifierResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null);
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'createConsentVerifier').mockImplementation(mockFunc);

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
