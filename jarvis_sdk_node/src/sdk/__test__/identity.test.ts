import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { parse, stringify, v4 } from 'uuid';
import {
  AssuranceLevel,
  BatchOperationResult,
} from '../../grpc/indykite/identity/v1beta1/attributes';
import {
  CancelInvitationRequest,
  CancelInvitationResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CheckConsentChallengeRequest,
  CheckConsentChallengeResponse,
  CheckInvitationStateRequest,
  CheckInvitationStateResponse,
  CreateConsentVerifierRequest,
  CreateConsentVerifierResponse,
  CreateInvitationRequest,
  CreateInvitationResponse,
  DeleteDigitalTwinRequest,
  DeleteDigitalTwinResponse,
  GetDigitalTwinRequest,
  GetDigitalTwinResponse,
  PatchDigitalTwinRequest,
  PatchDigitalTwinResponse,
  ResendInvitationRequest,
  ResendInvitationResponse,
  StartDigitalTwinEmailVerificationRequest,
  StartDigitalTwinEmailVerificationResponse,
  StartForgottenPasswordFlowRequest,
  StartForgottenPasswordFlowResponse,
  TokenIntrospectRequest,
  TokenIntrospectResponse,
  VerifyDigitalTwinEmailRequest,
  VerifyDigitalTwinEmailResponse,
} from '../../grpc/indykite/identity/v1beta1/identity_management_api';
import {
  DigitalEntity,
  DigitalTwin,
  DigitalTwinKind,
  DigitalTwinState,
  IdentityTokenInfo,
  ProviderType,
} from '../../grpc/indykite/identity/v1beta1/model';
import { SdkError, SdkErrorCode } from '../error';
import { IdentityClient } from '../identity';
import * as sdkTypes from '../model';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Audience, PatchResult } from '../model';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../utils/utils';
import { JsonObject } from '@protobuf-ts/runtime';
import { Invitation, InvitationState } from '../model/invitation';
import { NullValue } from '../../grpc/google/protobuf/struct';

let sdk: IdentityClient;
const applicationToken = {
  appSpaceId: '696e6479-6b69-4465-8000-010f00000000',
  appAgentId: '696e6479-6b69-4465-8000-050f00000000',
  endpoint: 'jarvis.local:8043',
  privateKeyJWK: {
    kty: 'EC',
    d: 'WNzV013IthOWgjef4eNVXzTQUYy6hb6DD5riu_5SZNI',
    use: 'sig',
    crv: 'P-256',
    kid: 'EfUEiFnOzA5PCp8SSksp7iXv7cHRehCsIGo6NAQ9H7w',
    x: 'sMeLa9xExlGkmo6tr2KSv4rqbYXdAM1RBkTNehZ_XfQ',
    y: 'FqBmruVIbVykGMWjVcv4VhN_XbMxW3rLqRcJ8mAUOdY',
    alg: 'ES256',
  },
};
const userToken =
  'eyJhbGciOiJFUzI1NiIsImN0eSI6IkpXVCIsImtpZCI6ImtRWnIyYUk1TUUwQ0o1ejR3U1AwQk9oNkRNOTI2QTVla2tfLUYtYmJBVnciLCJub25jZSI6IndiOHdnU0lTSlJ0ZFhUMDhXMU5NM3ciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiNjk2ZTY0NzktNmI2OS00NDY1LTgwMDAtMDIwMDAwMDAwMDAwIl0sImV4cCI6MTYyNTkwOTQ1MSwiaWF0IjoxNjI1OTA1ODUxLCJpc3MiOiJodHRwczovL2phcnZpcy1kZXYuaW5keWtpdGUuY29tL29hdXRoMi82OTZlNjQ3OS02YjY5LTQ0NjUtODAwMC0wMTAwMDAwMDAwMDAiLCJqdGkiOiI2ZmQ4NDI1NC1mODMwLTRiMzYtYWQ2YS1jZWQ4YWIxZGZmY2EjMCIsIm5iZiI6MTYyNTkwNTg1MSwic3ViIjoiNjk2ZTY0NzktNmI2OS00NDY1LTgwMDAtMDAwMDAwMDk5MDAyIn0.TPDZXU9peGYwBPrtwf-HfToIFsy1sbgjTHEXxJZqTFaOPWmlWPIyIDN6jMqNeuEI7BHG53JVAFzzh-65vi4R9Q';

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationToken);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('New client', () => {
  it('New instance creation', () => {
    jest.spyOn(IdentityClient, 'createInstance').mockImplementation((): Promise<IdentityClient> => {
      return Promise.resolve() as unknown as Promise<IdentityClient>;
    });
    IdentityClient.newClient(userToken);
    expect(IdentityClient.createInstance).toBeCalledWith(userToken);
  });
});

describe('Digital Twin', () => {
  it('Read - No response', async () => {
    const mockFunc = jest.fn(
      (
        request: GetDigitalTwinRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: GetDigitalTwinResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, undefined);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'getDigitalTwin').mockImplementation(mockFunc);

    const resp = sdk.getDigitalTwinByToken(userToken, []);
    expect(mockFunc).toHaveBeenCalled();
    expect(resp).rejects.toHaveProperty('message', 'Missing digital twin response');
  });

  it('Read - Too short token & bad missing DT', async () => {
    const mockResponse: GetDigitalTwinResponse = {
      digitalTwin: {} as DigitalEntity,
      tokenInfo: {} as IdentityTokenInfo,
    };
    const mockFunc = jest.fn(
      (
        request: GetDigitalTwinRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: GetDigitalTwinResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, mockResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'getDigitalTwin').mockImplementation(mockFunc);

    try {
      await sdk.getDigitalTwinByToken('TOO_SHORT_TOKEN', []);
    } catch (error) {
      expect((error as Error).message).toEqual('Token must be 32 chars or more.');
    }

    try {
      await sdk.getDigitalTwinByToken(userToken, []);
    } catch (error) {
      const e = error as SdkError;
      expect(e.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(e.message).toBe("Can't deserialize digital twin");
      expect(mockFunc).toBeCalled();
    }
  });

  it('Read - Success', async () => {
    const dt = {
      id: Utils.uuidToBuffer(v4()),
      tenantId: Utils.uuidToBuffer(v4()),
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
    } as DigitalTwin;
    const emailProperty = {
      id: v4(),
      definition: { property: 'email' },
      meta: {
        assuranceLevel: AssuranceLevel.LOW,
        issuer: 'indykite.id',
        primary: true,
        verifier: 'indykite.id',
        verificationTime: Utils.dateToTimestamp(new Date()),
      },
      value: {
        oneofKind: 'objectValue',
        objectValue: {
          value: {
            oneofKind: 'stringValue',
            stringValue: 'test+email@indykite.com',
          },
        },
      },
    };
    const mockResponse: GetDigitalTwinResponse = {
      digitalTwin: {
        properties: [emailProperty],
        createTime: Utils.dateToTimestamp(new Date()),
        digitalTwin: dt,
      } as DigitalEntity,
      tokenInfo: {
        customerId: Utils.uuidToBuffer(v4()),
        appSpaceId: Utils.uuidToBuffer(v4()),
        applicationId: Utils.uuidToBuffer(v4()),
        authenticationTime: Utils.dateToTimestamp(new Date()),
        expireTime: Utils.dateToTimestamp(new Date(Date.now() + 20 * 3600 * 1000)),
        issueTime: Utils.dateToTimestamp(new Date()),
        providerInfo: [
          {
            issuer: 'indykite.id',
            type: ProviderType.PASSWORD,
          },
        ],
        subject: dt,
      } as IdentityTokenInfo,
    };
    const mockFunc = jest.fn(
      (
        request: GetDigitalTwinRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: GetDigitalTwinResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, mockResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'getDigitalTwin').mockImplementation(mockFunc);

    const expectedDT = new sdkTypes.DigitalTwin(
      stringify(dt.id),
      stringify(dt.tenantId),
      dt.kind,
      dt.state,
      Utils.timestampToDate(mockResponse.digitalTwin?.createTime),
    );
    const email = new sdkTypes.Property(
      emailProperty.definition?.property ?? '',
      emailProperty.id,
    ).withValue(emailProperty.value.objectValue.value.stringValue);
    email.meta = {
      ...emailProperty.meta,
      verificationTime: Utils.timestampToDate(emailProperty.meta.verificationTime),
    };

    expectedDT.addProperty(email);

    let resp = await sdk.getDigitalTwinByToken(userToken, ['email']);
    expect(mockFunc).toBeCalled();
    expect(resp).toHaveProperty('tokenInfo');
    expect(resp).toHaveProperty('digitalTwin');
    let getEmail = resp.digitalTwin?.getProperty('email');
    expect(getEmail).toEqual(expectedDT.getProperty('email'));
    expect(resp.digitalTwin?.getPropertyValue('email')).toEqual(email.value);
    expect(resp.digitalTwin?.getProperty('undefined')).toBeUndefined();
    expect(resp.digitalTwin?.getProperties('email')).toHaveLength(1);

    resp = await sdk.getDigitalTwin(Buffer.from(dt.id), Buffer.from(dt.tenantId), ['email']);
    expect(mockFunc).toBeCalledTimes(2);
    expect(resp).toHaveProperty('tokenInfo');
    expect(resp).toHaveProperty('digitalTwin');
    getEmail = resp.digitalTwin?.getProperty('email');
    expect(getEmail).toEqual(expectedDT.getProperty('email'));
    expect(resp.digitalTwin?.getPropertyValue('email')).toEqual(email.value);
    expect(resp.digitalTwin?.getProperty('undefined')).toBeUndefined();
    expect(resp.digitalTwin?.getProperties('email')).toHaveLength(1);

    const email2nd = new sdkTypes.Property('email').withValue('to+second@indyklite.com');
    resp.digitalTwin?.addProperty(email2nd);
    expect(resp.digitalTwin?.getProperties('email')).toHaveLength(2);
  });

  it('Read - Failure', async () => {
    const dt = {
      id: Utils.uuidToBuffer(v4()),
      tenantId: Utils.uuidToBuffer(v4()),
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
    } as DigitalTwin;
    const mockResponse: GetDigitalTwinResponse = {};
    const mockErr = { code: Status.NOT_FOUND, details: 'DETAILS', metadata: {} } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: GetDigitalTwinRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: GetDigitalTwinResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(mockErr, mockResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'getDigitalTwin').mockImplementation(mockFunc);

    let resp = sdk.getDigitalTwinByToken(userToken, ['email']);
    expect(mockFunc).toHaveBeenCalled();
    expect(resp).rejects.toEqual(mockErr);

    resp = sdk.getDigitalTwin(Buffer.from(dt.id), Buffer.from(dt.tenantId), ['email']);
    expect(mockFunc).toBeCalledTimes(2);
    expect(resp).rejects.toEqual(mockErr);
  });

  it('Token introspection - Error', async () => {
    const mockResponse: TokenIntrospectResponse = { active: false };
    const mockErr = { code: Status.NOT_FOUND, details: 'DETAILS', metadata: {} } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: TokenIntrospectRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: TokenIntrospectResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(mockErr, mockResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'tokenIntrospect').mockImplementation(mockFunc);

    const resp = sdk.introspectToken('token');
    expect(mockFunc).toHaveBeenCalled();
    expect(resp).rejects.toEqual(mockErr);
  });

  it('Patch Properties - Add, Update, Delete', async () => {
    for (let k = 0; k < 2; k++) {
      const originalEmailId = v4();
      const newEmailId = v4();
      const dtId = v4();
      const tId = v4();
      const cDate = new Date();
      const dt = new sdkTypes.DigitalTwin(dtId, tId, 1, 1, cDate);
      const email = new sdkTypes.Property('email', originalEmailId).withValue(
        'test+to@indykite.com',
      );
      email.meta = {
        assuranceLevel: AssuranceLevel.LOW,
        issuer: 'indykite.id',
        primary: true,
      };
      dt.updateProperty(email);
      dt.addProperty(new sdkTypes.Property('lastName').withMetadata(true).withValue('LAST_NAME'));

      const newEmail = new sdkTypes.Property('email')
        .withMetadata(true)
        .withValue('newto+test@indykite.com');
      const firstName = new sdkTypes.Property('firstName')
        .withMetadata(true)
        .withValue('FIRST_NAME');
      const lastName = dt.getProperty('lastName');

      dt.addProperty(newEmail);
      dt.addProperty(firstName);
      dt.deleteProperty(email);
      if (lastName) dt.updateProperty(lastName?.withValue('NEW_LAST_NAME'));

      const mockResp = { result: [] as BatchOperationResult[] };
      const ids = [originalEmailId, newEmailId, v4(), null];
      for (let i = 0; i < 4; i++) {
        const bop = {
          index: `${i}`,
        } as BatchOperationResult;
        if (ids[i] != null) {
          bop.result = {
            oneofKind: 'success',
            success: {
              propertyId: ids[i] as string,
            },
          };
        }
        mockResp.result.push(bop);
      }

      const mockFunc = jest.fn(
        (
          request: PatchDigitalTwinRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: PatchDigitalTwinResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, mockResp);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'patchDigitalTwin').mockImplementation(mockFunc);

      let resp: PatchResult[];
      if (k == 0) {
        resp = await sdk.patchPropertiesByToken(userToken, dt);
      } else {
        resp = await sdk.patchProperties(dtId, tId, dt);
      }
      expect(mockFunc).toBeCalled();
      expect(resp).toEqual(mockResp.result.map((r) => PatchResult.deserialize(r)));
    }
  });

  it('Patch Properties - short token error', () => {
    const mockFunc = jest.fn(
      (
        request: PatchDigitalTwinRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: PatchDigitalTwinResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, {} as PatchDigitalTwinResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'patchDigitalTwin').mockImplementation(mockFunc);
    const dt = new sdkTypes.DigitalTwin(v4(), v4(), 1, 1, new Date());
    try {
      sdk.patchPropertiesByToken('short token', dt);
    } catch (err) {
      expect(mockFunc).not.toBeCalled();
      expect(err).toHaveProperty('message', 'Token must be 32 chars or more.');
    }
  });

  it('Patch Properties - errors', () => {
    [
      {
        svcerr: null,
        err: new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing patch response'),
        res: {} as PatchDigitalTwinResponse,
      },
      {
        svcerr: { code: Status.UNAUTHENTICATED, details: '', metadata: {} } as ServiceError,
        err: null,
        res: {} as PatchDigitalTwinResponse,
      },
    ].forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: PatchDigitalTwinRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: PatchDigitalTwinResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'patchDigitalTwin').mockImplementation(mockFunc);
      const dt = new sdkTypes.DigitalTwin(v4(), v4(), 1, 1, new Date());
      let resp = sdk.patchPropertiesByToken(userToken, dt);
      expect(mockFunc).toBeCalled();
      expect(resp).rejects.toEqual(clb.err || clb.svcerr);

      resp = sdk.patchProperties(v4(), v4(), dt);
      expect(mockFunc).toBeCalledTimes(2);
      expect(resp).rejects.toEqual(clb.err || clb.svcerr);
    });
  });

  it('email verification - true / false', () => {
    const dtId = v4();
    const tId = v4();
    const email = 'test+to@indykite.com';

    const clbs = [
      { err: null, res: {}, expected: true },
      {
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {},
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: StartDigitalTwinEmailVerificationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((
                error: ServiceError | null,
                response: StartDigitalTwinEmailVerificationResponse,
              ) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.err, clb.res);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'startDigitalTwinEmailVerification').mockImplementation(mockFunc);

      const resp = sdk.startEmailVerification(dtId, tId, email, {
        attr1: 'ATTR1_VALUE',
        attr2: true,
      });
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toBeTruthy();
      else expect(resp).rejects.toEqual(clb.err);
    });
  });

  it('verify digital twin - bad token', async () => {
    const mockFunc = jest.fn(
      (
        request: VerifyDigitalTwinEmailRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: VerifyDigitalTwinEmailResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, {});
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'verifyDigitalTwinEmail').mockImplementation(mockFunc);

    try {
      await sdk.verifyDigitalTwinEmail('TOO_SHORT_TOKEN');
    } catch (error) {
      expect((error as Error).message).toEqual('Token must be 32 chars or more.');
    }
  });

  it('verify digital twin - success', () => {
    const dtId = v4();
    const tId = v4();
    const mockResp = VerifyDigitalTwinEmailResponse.fromJson({
      digitalTwin: {
        id: Utils.uuidToBase64(dtId),
        tenantId: Utils.uuidToBase64(tId),
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
      },
    });
    const mockFunc = jest.fn(
      (
        request: VerifyDigitalTwinEmailRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: VerifyDigitalTwinEmailResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'verifyDigitalTwinEmail').mockImplementation(mockFunc);

    const expectedDT = new sdkTypes.DigitalTwin(dtId, tId, 1, 1);

    const resp = sdk.verifyDigitalTwinEmail(userToken);
    expect(mockFunc).toBeCalled();
    expect(resp).resolves.toEqual(expectedDT);
  });

  it('verify digital twin - error', () => {
    const mockSvcErr = { code: Status.NOT_FOUND, details: 'DETAILS', metadata: {} } as ServiceError;
    const mockErr = new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing verify email response');

    const clbs = [
      {
        svcerr: mockSvcErr,
        err: mockSvcErr,
        expected: false,
        res: {},
      },
      {
        svcerr: null,
        err: mockErr,
        expected: false,
        res: {},
      },
    ];
    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: VerifyDigitalTwinEmailRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: VerifyDigitalTwinEmailResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'verifyDigitalTwinEmail').mockImplementation(mockFunc);

      const resp = sdk.verifyDigitalTwinEmail(userToken);
      expect(mockFunc).toHaveBeenCalled();
      expect(resp).rejects.toEqual(clb.err);
    });
  });

  it('forgotten password - true / false', () => {
    const dtId = v4();
    const tId = v4();
    const clbs = [
      { err: null, res: {}, expected: true },
      {
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {},
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: StartForgottenPasswordFlowRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: StartForgottenPasswordFlowResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.err, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'startForgottenPasswordFlow').mockImplementation(mockFunc);

      const resp = sdk.startForgottenPasswordFlow(dtId, parse(tId) as Buffer);
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toBeTruthy();
      else expect(resp).rejects.toEqual(clb.err);
    });
  });

  it('change password by token - bad token', async () => {
    const mockFunc = jest.fn(
      (
        request: ChangePasswordRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ChangePasswordResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, {});
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'changePassword').mockImplementation(mockFunc);
    try {
      await sdk.changePasswordByToken('BAD TOKEN', 'pwd');
      expect(true).toBeFalsy();
    } catch (error) {
      expect((error as Error).message).toEqual('Token must be 32 chars or more.');
    }
  });

  it('change password by token - true / false', () => {
    const clbs = [
      { err: null, res: {}, expected: true },
      {
        err: null,
        res: {
          error: { code: '5' },
        },
        expected: false,
      },
      {
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {},
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: ChangePasswordRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: ChangePasswordResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.err, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'changePassword').mockImplementation(mockFunc);

      const resp = sdk.changePasswordByToken(userToken, 'newpwd');
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toBeTruthy();
      else expect(resp).rejects.toEqual(clb.err || clb.res.error);
    });
  });

  it('change password - bad digital twin', async () => {
    const error = new Error('Bad digital twin id') as ServiceError;
    const mockFunc = jest.fn(
      (
        request: ChangePasswordRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ChangePasswordResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(error, {});
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'changePassword').mockImplementation(mockFunc);
    try {
      await sdk.changePassword(v4(), v4(), 'newpwd');
      expect(true).toBeFalsy();
    } catch (thrownError) {
      expect(thrownError).toEqual(error);
    }
  });

  it('change password - true / false', () => {
    const clbs = [
      { err: null, res: {}, expected: true },
      {
        err: null,
        res: {
          error: { code: '5' },
        },
        expected: false,
      },
      {
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {},
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: ChangePasswordRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: ChangePasswordResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.err, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'changePassword').mockImplementation(mockFunc);

      const resp = sdk.changePassword(v4(), v4(), 'newpwd');
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toBeTruthy();
      else expect(resp).rejects.toEqual(clb.err || clb.res.error);
    });
  });

  it('change password - bad token', async () => {
    const mockFunc = jest.fn(
      (
        request: ChangePasswordRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ChangePasswordResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, {});
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'changePassword').mockImplementation(mockFunc);
    try {
      await sdk.changeMyPassword('BAD TOKEN', 'pwd');
      expect(true).toBeFalsy();
    } catch (error) {
      expect((error as Error).message).toEqual('Token must be 32 chars or more.');
    }
  });

  it('change password - true / false', () => {
    const clbs = [
      { err: null, res: {}, expected: true },
      {
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {},
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: ChangePasswordRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: ChangePasswordResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.err, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'changePassword').mockImplementation(mockFunc);

      let resp = sdk.changeMyPassword(userToken, 'newpwd');
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toBeTruthy();
      else expect(resp).rejects.toEqual(clb.err);

      resp = sdk.changePasswordOfDigitalTwin(v4(), v4(), 'newpwd');
      expect(mockFunc).toBeCalledTimes(2);
      if (clb.expected) expect(resp).resolves.toBeTruthy();
      else expect(resp).rejects.toEqual(clb.err);
    });
  });

  it('delete digital twin - bad token', async () => {
    const mockFunc = jest.fn(
      (
        request: DeleteDigitalTwinRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: DeleteDigitalTwinResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, {});
        return {} as SurfaceCall;
      },
    );
    jest.spyOn(sdk['client'], 'deleteDigitalTwin').mockImplementation(mockFunc);
    try {
      await sdk.deleteDigitalTwinByToken('BAD TOKEN');
      expect(true).toBeFalsy();
    } catch (error) {
      expect((error as Error).message).toEqual('Token must be 32 chars or more.');
    }
  });

  it('delete digital twin - true / false', () => {
    const dtId = v4();
    const tId = v4();
    const mockResp = DeleteDigitalTwinResponse.fromJson({
      digitalTwin: {
        id: Utils.uuidToBase64(dtId),
        tenantId: Utils.uuidToBase64(tId),
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
      },
    });
    const clbs = [
      {
        svcerr: null,
        err: null,
        res: mockResp,
        expected: new sdkTypes.DigitalTwin(dtId, tId, 1, 1),
      },
      {
        svcerr: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        res: {},
        expected: false,
      },
      {
        svcerr: null,
        err: new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'),
        res: {},
        expected: false,
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: DeleteDigitalTwinRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: DeleteDigitalTwinResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'deleteDigitalTwin').mockImplementation(mockFunc);

      let resp = sdk.deleteDigitalTwinByToken(userToken);
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toEqual(clb.expected);
      else expect(resp).rejects.toEqual(clb.err);

      resp = sdk.deleteDigitalTwin(dtId, tId);
      expect(mockFunc).toBeCalledTimes(2);
      if (clb.expected) expect(resp).resolves.toEqual(clb.expected);
      else expect(resp).rejects.toEqual(clb.err);
    });
  });

  it('check consent challenge', () => {
    const challengeToken = 'challenge_token';
    const clientId = v4();
    const scopes = [{ name: 'openid', description: '', displayName: '', required: false }];
    const requestUrl = 'http://www.example.com/oauth';
    const audiences = [] as Audience[];
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

  describe('createEmailInvitation', () => {
    describe('when only necessary parameters are used', () => {
      describe('when the response is successful', () => {
        const invitee = 'user@exmaple.com';
        const tenantId = v4();
        const referenceId = '123321';
        let result: unknown;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CreateInvitationRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function') callback(null, {});
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

          result = await sdk.createEmailInvitation(invitee, tenantId, referenceId);
        });

        it('sends correct request', () => {
          expect(sdk['client'].createInvitation).toBeCalledTimes(1);
          expect(sdk['client'].createInvitation).toBeCalledWith(
            {
              invitee: {
                email: invitee,
                oneofKind: 'email',
              },
              referenceId,
              tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
            },
            expect.any(Function),
          );
        });

        it('returns nothing', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when the response contains an error', () => {
        const invitee = 'user@exmaple.com';
        const tenantId = v4();
        const referenceId = '123321';
        const error = {
          code: Status.NOT_FOUND,
          details: 'no details',
          metadata: {},
        } as ServiceError;
        let caughtError: unknown;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CreateInvitationRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function') callback(error);
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

          try {
            await sdk.createEmailInvitation(invitee, tenantId, referenceId);
          } catch (err) {
            caughtError = err;
          }
        });

        it('throws the error', () => {
          expect(caughtError).toBe(error);
        });
      });
    });

    describe('when all parameters are used', () => {
      const invitee = 'user@exmaple.com';
      const tenantId = v4();
      const referenceId = '123321';
      const expireTime = new Date('2022-05-19T08:38:31Z');
      const invitationTime = new Date('2022-04-19T08:38:31Z');
      const messageAttributes = {
        testNumber: 42,
        testNull: null,
        testArray: [44],
        testMap: { testNestedDate: new Date('2022-05-21T07:37:42Z') },
      };
      let result: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CreateInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

        result = await sdk.createEmailInvitation(
          invitee,
          tenantId,
          referenceId,
          expireTime,
          invitationTime,
          messageAttributes,
        );
      });

      it('sends correct request', () => {
        expect(sdk['client'].createInvitation).toBeCalledTimes(1);
        expect(sdk['client'].createInvitation).toBeCalledWith(
          {
            invitee: {
              email: invitee,
              oneofKind: 'email',
            },
            referenceId,
            tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
            expireTime: Utils.dateToTimestamp(expireTime),
            inviteAtTime: Utils.dateToTimestamp(invitationTime),
            messageAttributes: {
              fields: {
                testNumber: {
                  value: {
                    oneofKind: 'doubleValue',
                    doubleValue: 42,
                  },
                },
                testNull: {
                  value: {
                    oneofKind: 'nullValue',
                    nullValue: NullValue.NULL_VALUE,
                  },
                },
                testArray: {
                  value: {
                    oneofKind: 'arrayValue',
                    arrayValue: {
                      values: [
                        {
                          value: {
                            oneofKind: 'doubleValue',
                            doubleValue: 44,
                          },
                        },
                      ],
                    },
                  },
                },
                testMap: {
                  value: {
                    oneofKind: 'mapValue',
                    mapValue: {
                      fields: {
                        testNestedDate: {
                          value: {
                            oneofKind: 'valueTime',
                            valueTime: {
                              nanos: 0,
                              seconds: '1653118662',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('createMobileInvitation', () => {
    describe('when only necessary parameters are used', () => {
      describe('when the response is successful', () => {
        const invitee = '+421949949949';
        const tenantId = v4();
        const referenceId = '123321';
        let result: unknown;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CreateInvitationRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function') callback(null, {});
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

          result = await sdk.createMobileInvitation(invitee, tenantId, referenceId);
        });

        it('sends correct request', () => {
          expect(sdk['client'].createInvitation).toBeCalledTimes(1);
          expect(sdk['client'].createInvitation).toBeCalledWith(
            {
              invitee: {
                mobile: invitee,
                oneofKind: 'mobile',
              },
              referenceId,
              tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
            },
            expect.any(Function),
          );
        });

        it('returns nothing', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when the response contains an error', () => {
        const invitee = '+421949949949';
        const tenantId = v4();
        const referenceId = '123321';
        const error = {
          code: Status.NOT_FOUND,
          details: 'no details',
          metadata: {},
        } as ServiceError;
        let caughtError: unknown;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CreateInvitationRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function') callback(error);
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

          try {
            await sdk.createEmailInvitation(invitee, tenantId, referenceId);
          } catch (err) {
            caughtError = err;
          }
        });

        it('throws the error', () => {
          expect(caughtError).toBe(error);
        });
      });
    });

    describe('when all parameters are used', () => {
      const invitee = '+421949949949';
      const tenantId = v4();
      const referenceId = '123321';
      const expireTime = new Date('2022-05-19T08:38:31Z');
      const invitationTime = new Date('2022-04-19T08:38:31Z');
      const messageAttributes = {
        testNumber: 42,
      };
      let result: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CreateInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

        result = await sdk.createMobileInvitation(
          invitee,
          tenantId,
          referenceId,
          expireTime,
          invitationTime,
          messageAttributes,
        );
      });

      it('sends correct request', () => {
        expect(sdk['client'].createInvitation).toBeCalledTimes(1);
        expect(sdk['client'].createInvitation).toBeCalledWith(
          {
            invitee: {
              mobile: invitee,
              oneofKind: 'mobile',
            },
            referenceId,
            tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
            expireTime: Utils.dateToTimestamp(expireTime),
            inviteAtTime: Utils.dateToTimestamp(invitationTime),
            messageAttributes: {
              fields: {
                testNumber: {
                  value: {
                    oneofKind: 'doubleValue',
                    doubleValue: 42,
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('checkInvitationState', () => {
    describe('when the response is successful', () => {
      describe('when a reference ID is used', () => {
        const referenceId = '123321';
        const tenantId = v4();
        let result: Invitation;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CheckInvitationStateRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function')
                callback(null, {
                  invitation: {
                    invitee: {
                      oneofKind: 'email',
                      email: 'user@example.com',
                    },
                    referenceId: '654321',
                    state: InvitationState.ACCEPTED,
                    tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
                  },
                });
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

          result = await sdk.checkInvitationState({ referenceId });
        });

        it('sends correct request', () => {
          expect(sdk['client'].checkInvitationState).toBeCalledTimes(1);
          expect(sdk['client'].checkInvitationState).toBeCalledWith(
            {
              identifier: {
                oneofKind: 'referenceId',
                referenceId,
              },
            },
            expect.any(Function),
          );
        });

        it('returns Invitation instance', () => {
          expect(result).toBeDefined();
          expect(result.invitee).toBe('user@example.com');
          expect(result.referenceId).toBe('654321');
          expect(result.state).toBe(InvitationState.ACCEPTED);
          expect(result.tenantId).toBe(tenantId);
        });
      });

      describe('when a invitation token is used', () => {
        const invitationToken = '789789';
        const tenantId = v4();
        let result: Invitation;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CheckInvitationStateRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function')
                callback(null, {
                  invitation: {
                    invitee: {
                      oneofKind: 'email',
                      email: 'user@example.com',
                    },
                    referenceId: '654321',
                    state: InvitationState.EXPIRED,
                    tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
                  },
                });
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

          result = await sdk.checkInvitationState({ invitationToken });
        });

        it('sends correct request', () => {
          expect(sdk['client'].checkInvitationState).toBeCalledTimes(1);
          expect(sdk['client'].checkInvitationState).toBeCalledWith(
            {
              identifier: {
                oneofKind: 'invitationToken',
                invitationToken,
              },
            },
            expect.any(Function),
          );
        });

        it('returns Invitation instance', () => {
          expect(result).toBeDefined();
          expect(result.invitee).toBe('user@example.com');
          expect(result.referenceId).toBe('654321');
          expect(result.state).toBe(InvitationState.EXPIRED);
          expect(result.tenantId).toBe(tenantId);
        });
      });

      describe('when no token is used', () => {
        const tenantId = v4();
        let caughtError: unknown;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CheckInvitationStateRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function')
                callback(null, {
                  invitation: {
                    invitee: {
                      oneofKind: 'email',
                      email: 'user@example.com',
                    },
                    referenceId: '654321',
                    state: InvitationState.EXPIRED,
                    tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
                  },
                });
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

          try {
            await sdk.checkInvitationState({});
          } catch (err) {
            caughtError = err;
          }
        });

        it('sends no request', () => {
          expect(sdk['client'].checkInvitationState).toBeCalledTimes(0);
        });

        it('throws an error', () => {
          expect(caughtError).toHaveProperty(
            'message',
            'You have not specified neither reference ID nor invitation token',
          );
        });
      });

      describe('when both tokens are used', () => {
        const tenantId = v4();
        const invitationToken = '789789';
        const referenceId = '123321';
        let caughtError: unknown;

        beforeEach(async () => {
          const mockFunc = jest.fn(
            (
              request: CheckInvitationStateRequest,
              callback:
                | Metadata
                | CallOptions
                | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
            ): SurfaceCall => {
              if (typeof callback === 'function')
                callback(null, {
                  invitation: {
                    invitee: {
                      oneofKind: 'email',
                      email: 'user@example.com',
                    },
                    referenceId: '654321',
                    state: InvitationState.EXPIRED,
                    tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
                  },
                });
              return {} as SurfaceCall;
            },
          );

          jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

          try {
            await sdk.checkInvitationState({ invitationToken, referenceId });
          } catch (err) {
            caughtError = err;
          }
        });

        it('sends no request', () => {
          expect(sdk['client'].checkInvitationState).toBeCalledTimes(0);
        });

        it('throws an error', () => {
          expect(caughtError).toHaveProperty(
            'message',
            'You can not specify both the reference ID and the invitation token',
          );
        });
      });
    });

    describe('when the response does not have any content', () => {
      const referenceId = '123321';
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CheckInvitationStateRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null);
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

        try {
          await sdk.checkInvitationState({ referenceId });
        } catch (err) {
          caughtError = err;
        }
      });

      it('throws the error', () => {
        expect(caughtError).toHaveProperty('message', 'Missing check invitation response');
      });
    });

    describe('when the response contains an error', () => {
      const referenceId = '123321';
      const error = {
        code: Status.NOT_FOUND,
        details: 'no details',
        metadata: {},
      } as ServiceError;
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CheckInvitationStateRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(error);
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

        try {
          await sdk.checkInvitationState({ referenceId });
        } catch (err) {
          caughtError = err;
        }
      });

      it('throws the error', () => {
        expect(caughtError).toBe(error);
      });
    });
  });

  describe('resendInvitation', () => {
    describe('when the response is successful', () => {
      const referenceId = '123321';
      let result: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: ResendInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: ResendInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'resendInvitation').mockImplementation(mockFunc);

        result = await sdk.resendInvitation(referenceId);
      });

      it('sends correct request', () => {
        expect(sdk['client'].resendInvitation).toBeCalledTimes(1);
        expect(sdk['client'].resendInvitation).toBeCalledWith(
          {
            referenceId,
          },
          expect.any(Function),
        );
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when the response contains an error', () => {
      const referenceId = '123321';
      const error = {
        code: Status.NOT_FOUND,
        details: 'no details',
        metadata: {},
      } as ServiceError;
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: ResendInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: ResendInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(error);
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'resendInvitation').mockImplementation(mockFunc);

        try {
          await sdk.resendInvitation(referenceId);
        } catch (err) {
          caughtError = err;
        }
      });

      it('throws the error', () => {
        expect(caughtError).toBe(error);
      });
    });
  });

  describe('cancelInvitation', () => {
    describe('when the response is successful', () => {
      const referenceId = '123321';
      let result: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CancelInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CancelInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'cancelInvitation').mockImplementation(mockFunc);

        result = await sdk.cancelInvitation(referenceId);
      });

      it('sends correct request', () => {
        expect(sdk['client'].cancelInvitation).toBeCalledTimes(1);
        expect(sdk['client'].cancelInvitation).toBeCalledWith(
          {
            referenceId,
          },
          expect.any(Function),
        );
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when the response contains an error', () => {
      const referenceId = '123321';
      const error = {
        code: Status.NOT_FOUND,
        details: 'no details',
        metadata: {},
      } as ServiceError;
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CancelInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CancelInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(error);
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'cancelInvitation').mockImplementation(mockFunc);

        try {
          await sdk.cancelInvitation(referenceId);
        } catch (err) {
          caughtError = err;
        }
      });

      it('throws the error', () => {
        expect(caughtError).toBe(error);
      });
    });
  });
});
