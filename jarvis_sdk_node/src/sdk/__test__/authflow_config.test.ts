import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { ClientUnaryCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { v4 } from 'uuid';
import { BoolValue } from '../../grpc/google/protobuf/wrappers';
import {
  CreateConfigNodeRequest,
  CreateConfigNodeResponse,
  DeleteConfigNodeRequest,
  DeleteConfigNodeResponse,
  ReadConfigNodeRequest,
  ReadConfigNodeResponse,
  UpdateConfigNodeRequest,
  UpdateConfigNodeResponse,
} from '../../grpc/indykite/config/v1beta1/config_management_api';
import { AuthFlowConfig_Format } from '../../grpc/indykite/config/v1beta1/model';
import { ConfigClient } from '../config';
import { SdkError, SdkErrorCode } from '../error';
import { AuthFlow } from '../model/config/authflow/flow';
import { Utils } from '../utils/utils';

let sdk: ConfigClient;

const userToken = 'USER_TOKEN';
const proto = {
  typeUrl: 'TYPE_URL',
  value: Buffer.from('PROTO_VALUE'),
};

beforeAll(async () => {
  process.env.JARVIS_ENDPOINT = 'NOT_USED';
  sdk = await ConfigClient.createInstance(userToken);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Authentication Flow', () => {
  it('Create - Success', async () => {
    const mockResp = CreateConfigNodeResponse.fromJson({
      id: Utils.uuidToBase64(v4()),
      etag: new Date().toISOString(),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });
    const mockFunc = jest.fn(
      (
        request: CreateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: CreateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'createConfigNode').mockImplementation(mockFunc);

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('The Flow'),
      true,
    );
    const resp = await sdk.createAuthflowConfiguration('gid:KAEyEGluZHlraURlgAAAAAAAAA8', authFlow);

    const expectedResp = Object.assign(mockResp, authFlow);

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedResp);
  });

  it('Create - No response', async () => {
    const mockFunc = jest.fn(
      (
        request: CreateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: CreateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'createConfigNode').mockImplementation(mockFunc);

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('The Flow'),
      true,
    );
    const resp = sdk.createAuthflowConfiguration('gid:KAEyEGluZHlraURlgAAAAAAAAA8', authFlow);

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty('message', 'No auth flow response');
  });

  it('Read - no proto - Success', async () => {
    const objectId = v4();
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'nodejs-authflow-name',
        displayName: 'NodeJS Authflow Name',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: v4(),
        tenantId: v4(),
        description: 'description',
      },
    });
    if (mockResp.configNode) {
      mockResp.configNode.config = {
        oneofKind: 'authFlowConfig',
        authFlowConfig: {
          sourceFormat: AuthFlowConfig_Format.RICH_JSON,
          source: Buffer.from('AUTH_FLOW'),
        },
      };
    }
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);
    const expectedAuthFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('AUTH_FLOW'),
      false,
    );
    if (mockResp.configNode) {
      expectedAuthFlow.id = objectId;
      expectedAuthFlow.displayName = mockResp.configNode.displayName;
      expectedAuthFlow.etag = mockResp.configNode.etag;
      expectedAuthFlow.createTime = Utils.timestampToDate(mockResp.configNode.createTime);
      expectedAuthFlow.updateTime = Utils.timestampToDate(mockResp.configNode.updateTime);
      expectedAuthFlow.customerId = mockResp.configNode.customerId;
      expectedAuthFlow.appSpaceId = mockResp.configNode.appSpaceId;
      expectedAuthFlow.tenantId = mockResp.configNode.tenantId;
      expectedAuthFlow.description = mockResp.configNode.description?.value;
    }

    const resp = await sdk.readAuthflowConfiguration(objectId);
    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedAuthFlow);
  });

  it('Read - missing config', async () => {
    const objectId = v4();
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'nodejs-authflow-name',
        displayName: '',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: v4(),
        tenantId: v4(),
      },
    });
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);

    try {
      await sdk.readAuthflowConfiguration(objectId);
      expect(true).toEqual(false);
    } catch (error) {
      const e = error as SdkError;
      expect(e.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(e.message).toBe("can't unmarshal configuration: undefined");
    }
    expect(mockFunc).toBeCalled();
  });

  it('Read - with proto - Success', async () => {
    const objectId = v4();
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'nodejs-authflow-name',
        displayName: '',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: v4(),
        tenantId: v4(),
      },
    });
    if (mockResp.configNode) {
      mockResp.configNode.config = {
        oneofKind: 'authFlowConfig',
        authFlowConfig: {
          sourceFormat: AuthFlowConfig_Format.RICH_JSON,
          source: Buffer.from('AUTH_FLOW'),
          default: BoolValue.fromJson(true),
          proto,
        },
      };
    }
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);
    const expectedAuthFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('AUTH_FLOW'),
      true,
    );
    if (mockResp.configNode) {
      expectedAuthFlow.id = objectId;
      expectedAuthFlow.displayName = mockResp.configNode.displayName;
      expectedAuthFlow.etag = mockResp.configNode.etag;
      expectedAuthFlow.createTime = Utils.timestampToDate(mockResp.configNode.createTime);
      expectedAuthFlow.updateTime = Utils.timestampToDate(mockResp.configNode.updateTime);
      expectedAuthFlow.customerId = mockResp.configNode.customerId;
      expectedAuthFlow.appSpaceId = mockResp.configNode.appSpaceId;
      expectedAuthFlow.tenantId = mockResp.configNode.tenantId;
      expectedAuthFlow.proto = proto;
    }

    const resp = await sdk.readAuthflowConfiguration(objectId);
    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedAuthFlow);
  });

  it('Update - no proto - Success', async () => {
    const mockResp = UpdateConfigNodeResponse.fromJson({
      id: Utils.uuidToBase64(v4()),
      etag: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = mockResp.id;
    authFlow.createTime = new Date();
    authFlow.updateTime = Utils.timestampToDate(mockResp.updateTime);
    authFlow.etag = mockResp.etag;
    authFlow.description = 'NEW_DESCRIPTION';

    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);

    const resp = await sdk.updateAuthflowConfiguration(authFlow);
    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(authFlow);
  });

  it('Update - with proto - Success', async () => {
    const mockResp = UpdateConfigNodeResponse.fromJson({
      id: Utils.uuidToBase64(v4()),
      etag: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = mockResp.id;
    authFlow.createTime = new Date();
    authFlow.updateTime = Utils.timestampToDate(mockResp.updateTime);
    authFlow.etag = mockResp.etag;
    authFlow.description = 'NEW_DESCRIPTION';
    authFlow.proto = proto;

    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);

    const resp = await sdk.updateAuthflowConfiguration(authFlow);
    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(authFlow);
  });

  it('Update - no response', async () => {
    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = Utils.uuidToBase64(v4());
    authFlow.createTime = new Date();
    authFlow.updateTime = new Date();
    authFlow.etag = new Date().toISOString();
    authFlow.description = 'NEW_DESCRIPTION';
    authFlow.proto = proto;

    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);

    const resp = sdk.updateAuthflowConfiguration(authFlow);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty(
      'message',
      `Update returned with different id: req.iq=${authFlow.id}, res.id=undefined`,
    );
  });

  it('Delete - true', async () => {
    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = v4();

    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, DeleteConfigNodeResponse.fromJson({}));
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'deleteConfigNode').mockImplementation(mockFunc);

    const resp = sdk.deleteAuthflowConfiguration(authFlow);
    expect(mockFunc).toBeCalled();
    expect(resp).resolves.toBeTruthy();
  });

  it('Delete - false', async () => {
    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = v4();

    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') {
          callback(
            { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
            DeleteConfigNodeResponse.fromJson({}),
          );
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'deleteConfigNode').mockImplementation(mockFunc);

    const resp = sdk.deleteAuthflowConfiguration(authFlow);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toBeFalsy();
  });
});
