import { Metadata, ServiceError } from '@grpc/grpc-js';
import { ClientUnaryCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { parse, v4 } from 'uuid';
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
    const mockResp = CreateConfigNodeResponse.fromJSON({
      id: parse(v4()),
      etag: new String(Date.now()),
      createTime: new Date(),
      updateTime: new Date(),
    });
    const mockFunc = jest.fn(
      (
        request: CreateConfigNodeRequest,
        callback:
          | Metadata
          | ((error: ServiceError | null, response: CreateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'createConfigNode').mockImplementation(mockFunc);

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('The Flow'),
      true,
    );
    const resp = await sdk.createAuthflowConfiguration('gid:KAEyEGluZHlraURlgAAAAAAAAA8', authFlow);

    const expectedResp = Object.assign(mockResp, authFlow);

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedResp);
  });

  it('Read - no proto - Success', async () => {
    const objectId = v4();
    const mockResp = ReadConfigNodeResponse.fromJSON({
      configNode: {
        name: 'nodejs-authflow-name',
        displayName: '',
        id: objectId,
        etag: new String(Date.now()),
        createTime: new Date(),
        updateTime: new Date(),
        customerId: v4(),
        appSpaceId: v4(),
        tenantId: v4(),
      },
    });
    if (mockResp.configNode) {
      mockResp.configNode.config = {
        $case: 'authFlowConfig',
        authFlowConfig: {
          sourceFormat: AuthFlowConfig_Format.FORMAT_RICH_JSON,
          source: Buffer.from('AUTH_FLOW'),
          default: true,
        },
      };
    }
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);
    const expectedAuthFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('AUTH_FLOW'),
      true,
    );
    if (mockResp.configNode) {
      expectedAuthFlow.id = objectId;
      expectedAuthFlow.displayName = mockResp.configNode.displayName;
      expectedAuthFlow.etag = mockResp.configNode.etag;
      expectedAuthFlow.createTime = mockResp.configNode.createTime;
      expectedAuthFlow.updateTime = mockResp.configNode.updateTime;
      expectedAuthFlow.customerId = mockResp.configNode.customerId;
      expectedAuthFlow.appSpaceId = mockResp.configNode.appSpaceId;
      expectedAuthFlow.tenantId = mockResp.configNode.tenantId;
    }

    const resp = await sdk.readAuthflowConfiguration(objectId);
    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedAuthFlow);
  });

  it('Read - missing config', async () => {
    const objectId = v4();
    const mockResp = ReadConfigNodeResponse.fromJSON({
      configNode: {
        name: 'nodejs-authflow-name',
        displayName: '',
        id: objectId,
        etag: new String(Date.now()),
        createTime: new Date(),
        updateTime: new Date(),
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
    const mockResp = ReadConfigNodeResponse.fromJSON({
      configNode: {
        name: 'nodejs-authflow-name',
        displayName: '',
        id: objectId,
        etag: new String(Date.now()),
        createTime: new Date(),
        updateTime: new Date(),
        customerId: v4(),
        appSpaceId: v4(),
        tenantId: v4(),
      },
    });
    if (mockResp.configNode) {
      mockResp.configNode.config = {
        $case: 'authFlowConfig',
        authFlowConfig: {
          sourceFormat: AuthFlowConfig_Format.FORMAT_RICH_JSON,
          source: Buffer.from('AUTH_FLOW'),
          default: true,
          proto,
        },
      };
    }
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);
    const expectedAuthFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('AUTH_FLOW'),
      true,
    );
    if (mockResp.configNode) {
      expectedAuthFlow.id = objectId;
      expectedAuthFlow.displayName = mockResp.configNode.displayName;
      expectedAuthFlow.etag = mockResp.configNode.etag;
      expectedAuthFlow.createTime = mockResp.configNode.createTime;
      expectedAuthFlow.updateTime = mockResp.configNode.updateTime;
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
    const mockResp = UpdateConfigNodeResponse.fromJSON({
      id: parse(v4()),
      etag: new String(Date.now()),
      updateTime: new Date(),
    });

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = mockResp.id;
    authFlow.createTime = new Date();
    authFlow.updateTime = mockResp.updateTime;
    authFlow.etag = mockResp.etag;
    authFlow.description = 'NEW_DESCRIPTION';

    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
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
    const mockResp = UpdateConfigNodeResponse.fromJSON({
      id: parse(v4()),
      etag: new String(Date.now()),
      updateTime: new Date(),
    });

    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = mockResp.id;
    authFlow.createTime = new Date();
    authFlow.updateTime = mockResp.updateTime;
    authFlow.etag = mockResp.etag;
    authFlow.description = 'NEW_DESCRIPTION';
    authFlow.proto = proto;

    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
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

  it('Delete - true', async () => {
    const authFlow = new AuthFlow(
      'nodejs-authflow-name',
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = v4();

    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, DeleteConfigNodeResponse.fromJSON({}));
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
      AuthFlowConfig_Format.FORMAT_RICH_JSON,
      Buffer.from('THE_FLOW'),
      true,
    );
    authFlow.id = v4();

    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') {
          callback(
            { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
            DeleteConfigNodeResponse.fromJSON({}),
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
