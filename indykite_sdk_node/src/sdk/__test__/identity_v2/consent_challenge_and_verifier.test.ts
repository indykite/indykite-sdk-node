import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CheckOAuth2ConsentChallengeResponse,
  CreateOAuth2ConsentVerifierResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';

describe('checkConsentChallenge', () => {
  describe('when no error is returned', () => {
    const checkConsentChallengeResponse: CheckOAuth2ConsentChallengeResponse = {
      clientId: 'client-id',
      acrs: [],
      appSpaceId: 'app-space-id',
      audiences: [],
      requestUrl: 'https://example.com/oauth2',
      scopes: [
        {
          name: 'openid',
          required: true,
          displayName: 'Open ID',
          description: '',
        },
      ],
      skip: false,
      subjectIdentifier: 'subject',
    };
    let checkOAuth2ConsentChallengeSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: CheckOAuth2ConsentChallengeResponse | undefined;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      checkOAuth2ConsentChallengeSpy = jest
        .spyOn(sdk['client'], 'checkOAuth2ConsentChallenge')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CheckOAuth2ConsentChallengeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, checkConsentChallengeResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.checkConsentChallenge({
        challenge: 'consent-challenge-token',
      });
    });

    it('sends correct request', () => {
      expect(checkOAuth2ConsentChallengeSpy).toBeCalledWith(
        {
          challenge: 'consent-challenge-token',
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(checkConsentChallengeResponse);
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'checkOAuth2ConsentChallenge')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: CheckOAuth2ConsentChallengeResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .checkConsentChallenge({
          challenge: 'consent-challenge-token',
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('createConsentVerifier', () => {
  describe('when no error is returned', () => {
    const createConsentVerifierResponse: CreateOAuth2ConsentVerifierResponse = {
      authorizationEndpoint: 'http://example.com',
      verifier: 'consent-verifier-token',
    };
    let checkOAuth2ConsentChallengeSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: CreateOAuth2ConsentVerifierResponse | undefined;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      checkOAuth2ConsentChallengeSpy = jest
        .spyOn(sdk['client'], 'createOAuth2ConsentVerifier')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateOAuth2ConsentVerifierResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, createConsentVerifierResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.createConsentVerifier({
        consentChallenge: 'consent-challenge-token',
        result: {
          oneofKind: 'approval',
          approval: {
            grantedAudiences: ['audience-id'],
            grantScopes: ['openid'],
            remember: false,
            rememberFor: '0',
          },
        },
      });
    });

    it('sends correct request', () => {
      expect(checkOAuth2ConsentChallengeSpy).toBeCalledWith(
        {
          consentChallenge: 'consent-challenge-token',
          result: {
            oneofKind: 'approval',
            approval: {
              grantedAudiences: ['audience-id'],
              grantScopes: ['openid'],
              remember: false,
              rememberFor: '0',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(createConsentVerifierResponse);
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'createOAuth2ConsentVerifier')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: CreateOAuth2ConsentVerifierResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createConsentVerifier({
          consentChallenge: 'consent-challenge-token',
          result: {
            oneofKind: 'approval',
            approval: {
              grantedAudiences: ['audience-id'],
              grantScopes: ['openid'],
              remember: false,
              rememberFor: '0',
            },
          },
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
