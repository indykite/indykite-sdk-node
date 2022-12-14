import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { parse, stringify, v4 } from 'uuid';
import {
  AssuranceLevel,
  BatchOperationResult,
  Property,
} from '../../../grpc/indykite/identity/v1beta1/attributes';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteDigitalTwinRequest,
  DeleteDigitalTwinResponse,
  GetDigitalTwinRequest,
  GetDigitalTwinResponse,
  ListDigitalTwinsRequest,
  ListDigitalTwinsResponse,
  PatchDigitalTwinRequest,
  PatchDigitalTwinResponse,
  StartDigitalTwinEmailVerificationRequest,
  StartDigitalTwinEmailVerificationResponse,
  StartForgottenPasswordFlowRequest,
  StartForgottenPasswordFlowResponse,
  TokenIntrospectRequest,
  TokenIntrospectResponse,
  VerifyDigitalTwinEmailRequest,
  VerifyDigitalTwinEmailResponse,
} from '../../../grpc/indykite/identity/v1beta1/identity_management_api';
import {
  DigitalEntity,
  DigitalTwin,
  DigitalTwinKind,
  DigitalTwinState,
  IdentityTokenInfo,
  ProviderType,
} from '../../../grpc/indykite/identity/v1beta1/model';
import { SdkError, SdkErrorCode } from '../../error';
import { IdentityClient } from '../../identity';
import * as sdkTypes from '../../model';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { PatchResult, PropertyMetaData } from '../../model';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';

let sdk: IdentityClient;
const userToken = 'user-token-token-token-token-token';

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
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
      id: Utils.uuidToUint8Array(v4()),
      tenantId: Utils.uuidToUint8Array(v4()),
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
      dt.tags,
      Utils.timestampToDate(mockResponse.digitalTwin?.createTime),
    );
    const email = new sdkTypes.Property(
      emailProperty.definition?.property ?? '',
      emailProperty.id,
    ).withValue(emailProperty.value.objectValue.value.stringValue);
    email.meta = new PropertyMetaData();
    Object.assign(email.meta, {
      ...emailProperty.meta,
      verificationTime: Utils.timestampToDate(emailProperty.meta.verificationTime),
    });

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
      tags: [],
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
      const dt = new sdkTypes.DigitalTwin(dtId, tId, 1, 1, [], cDate);
      const email = new sdkTypes.Property('email', originalEmailId).withValue(
        'test+to@indykite.com',
      );
      email.meta = new PropertyMetaData();
      Object.assign(email.meta, {
        assuranceLevel: AssuranceLevel.LOW,
        issuer: 'indykite.id',
        primary: true,
      });
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
    const dt = new sdkTypes.DigitalTwin(v4(), v4(), 1, 1, [], new Date());
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
      const dt = new sdkTypes.DigitalTwin(v4(), v4(), 1, 1, [], new Date());
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

    const expectedDT = new sdkTypes.DigitalTwin(dtId, tId, 1, 1, []);

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
        expected: new sdkTypes.DigitalTwin(dtId, tId, 1, 1, []),
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

  it('list digital twins', () => {
    const dtId = v4();
    const tId = v4();
    const collectionId = v4();
    const propertyId = v4();
    const emailVerificationTime = new Date();
    const tags: string[] = [];
    const createTime = new Date();
    const emailProperty = Property.create({
      id: propertyId,
      definition: { property: 'email' },
      meta: {
        assuranceLevel: AssuranceLevel.LOW,
        issuer: 'indykite.id',
        primary: true,
        verifier: 'indykite.id',
        verificationTime: Utils.dateToTimestamp(emailVerificationTime),
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
    });
    const mockResp = ListDigitalTwinsResponse.fromJson({
      nextPageToken: 'next-page-token',
      digitalTwin: [
        {
          digitalTwin: {
            id: Utils.uuidToBase64(dtId),
            tenantId: Utils.uuidToBase64(tId),
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
          },
          createTime: createTime.toISOString(),
          properties: [Property.toJson(emailProperty)],
        },
      ],
    });

    const expectedDigitalTwin = new sdkTypes.DigitalTwin(
      dtId,
      tId,
      DigitalTwinKind.PERSON,
      DigitalTwinState.ACTIVE,
      tags,
      createTime,
    );
    const expectedDigitalTwinProperty = Object.assign(
      new sdkTypes.Property('email', propertyId).withValue('test+email@indykite.com'),
      { context: '', type: '' },
    );
    expectedDigitalTwinProperty.meta = Object.assign(new sdkTypes.PropertyMetaData(), {
      assuranceLevel: 1,
      issuer: 'indykite.id',
      primary: true,
      verificationTime: emailVerificationTime,
      verifier: 'indykite.id',
    });
    expectedDigitalTwin.properties = { email: [expectedDigitalTwinProperty] };

    const clbs = [
      {
        svcerr: null,
        err: null,
        res: mockResp,
        expected: {
          digitalTwins: [expectedDigitalTwin],
          nextPageToken: 'next-page-token',
        },
      },
      {
        svcerr: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        err: { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
        expected: false,
      },
      {
        svcerr: null,
        err: null,
        expected: {
          digitalTwins: [],
        },
      },
    ];

    clbs.forEach((clb) => {
      const mockFunc = jest.fn(
        (
          request: ListDigitalTwinsRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ListDigitalTwinsResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(clb.svcerr, clb.res);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'listDigitalTwins').mockImplementation(mockFunc);

      const resp = sdk.listDigitalTwins(
        tId,
        collectionId,
        ['email'],
        10,
        'page-token-request',
        'name',
      );
      expect(mockFunc).toBeCalled();
      if (clb.expected) expect(resp).resolves.toEqual(clb.expected);
      else expect(resp).rejects.toEqual(clb.err);
    });
  });
});
