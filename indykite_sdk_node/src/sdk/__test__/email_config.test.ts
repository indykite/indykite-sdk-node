import { CallOptions, ServiceError } from '@grpc/grpc-js';
import { ClientUnaryCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Metadata } from '@grpc/grpc-js/build/src/metadata';
import { v4 } from 'uuid';
import { StringValue } from '../../grpc/google/protobuf/wrappers';
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
import {
  AuthFlowConfig,
  EmailDefinition,
  EmailServiceConfig,
} from '../../grpc/indykite/config/v1beta1/model';
import { ConfigClient } from '../config';
import { SdkError, SdkErrorCode } from '../error';
import { EmailMessage, SendgridEmailProvider } from '../model';
import { AuthFlow } from '../model/config/authflow/flow';
import { EmailTemplate } from '../model/config/email/template';
import { serviceAccountTokenMock } from '../utils/test_utils';
import { Utils } from '../utils/utils';

let sdk: ConfigClient;

const TEST_TO_EMAIL = { address: 'test+to@indykite.com', name: 'Test To' };

beforeAll(async () => {
  process.env.JARVIS_ENDPOINT = 'NOT_USED';
  sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
});

afterEach(() => {
  jest.resetAllMocks();
});

function createSendgridObject(msg = true): SendgridEmailProvider {
  const sendgrid = new SendgridEmailProvider('nodejs-ec-1', v4(), true);
  const tmpl = new EmailTemplate(v4(), [TEST_TO_EMAIL], 'subject');
  tmpl.headers['HEADER_1'] = 'header1';
  tmpl.from = { address: 'test+from@indykite.com', name: 'From' };
  tmpl.replyTo = { address: 'test+replyto@indykite.com', name: 'Reply To' };
  tmpl.eventPayload = 'Event Payload';
  const emailMsg = new EmailMessage([TEST_TO_EMAIL], 'subject');
  emailMsg.from = TEST_TO_EMAIL;
  emailMsg.replyTo = TEST_TO_EMAIL;

  if (msg) {
    emailMsg.withHtmlContent('<html></html>');
    sendgrid.setMessage('oneTimePassword', emailMsg);
    sendgrid.setMessage('invitation', tmpl);
  } else {
    emailMsg.withTextContent('Text Content');
    sendgrid.setMessage('resetPassword', emailMsg);
    sendgrid.setMessage('verification', tmpl);
  }
  sendgrid.setDefaultFrom(TEST_TO_EMAIL);
  sendgrid.description = 'description-';
  return sendgrid;
}

describe('Invalid Token', () => {
  it('Invalid or Expired token', async () => {
    const mockErr = {
      code: Status.UNAUTHENTICATED,
      details: 'invalid or expired access_token',
      metadata: new Metadata(),
      name: '',
      message: '',
    };

    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(mockErr, {});
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);

    const resp = sdk.readEmailServiceConfiguration('MISSING_CONFIG_ID');
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(mockErr);
  });
});

describe('Email Configuration', () => {
  it('Create Sendgrid Provider', async () => {
    const mockResp = CreateConfigNodeResponse.fromJson({
      id: v4(),
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

    const resp = await sdk.createEmailServiceConfiguration(
      'gid:KAEyEGluZHlraURlgAAAAAAAAA8',
      createSendgridObject(),
    );

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual({ ...mockResp });
  });
});

describe('Email Configuration - Error', () => {
  it('Create Sendgrid Provider', async () => {
    const mockResp = CreateConfigNodeResponse.fromJson({
      id: v4(),
      etag: new Date().toISOString(),
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });
    const mockError = { message: 'Configuration error' } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: CreateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: CreateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(mockError, mockResp);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'createConfigNode').mockImplementation(mockFunc);

    const resp = sdk.createEmailServiceConfiguration(
      'gid:KAEyEGluZHlraURlgAAAAAAAAA8',
      createSendgridObject(),
    );

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(mockError);
  });
});

describe('Read, Update, Delete - Email Configuration', () => {
  const apiKey = v4();
  const objectId = 'gid:ChBpbmR5a2lEZYAAAAAAAAAPKAgyECQ5IfNE10V1hFzMR_8ZeP4';
  const templateId = v4();

  it('Read - Success', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    const emailMsg = {
      email: {
        oneofKind: 'message',
        message: {
          to: [TEST_TO_EMAIL],
          cc: [],
          bcc: [],
          from: {
            address: 'user@example.com',
            name: 'User',
          },
          replyTo: {
            address: 'anotherUser@example.com',
            name: 'Another User',
          },
          subject: 'subject',
          htmlContent: '',
          textContent: 'Text Email Content',
          headers: {},
          customArgs: {},
          dynamicTemplateValues: {},
          attachments: [],
          categories: [],
        },
      },
    } as EmailDefinition;
    const emailTmpl = {
      email: {
        oneofKind: 'template',
        template: {
          templateId,
          headers: {},
          substitutions: {},
          attachments: [],
          categories: [],
          customArgs: {},
          dynamicTemplateValues: {},
          templateArn: 'Template ARN',
          to: [TEST_TO_EMAIL],
          cc: [],
          bcc: [],
          subject: 'subject',
          eventPayload: StringValue.fromJson('Event Payload'),
          templateVersion: StringValue.fromJson('Template Version'),
        },
      },
    } as EmailDefinition;

    if (mockResp.configNode)
      mockResp.configNode.config = {
        oneofKind: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
          provider: {
            oneofKind: 'sendgrid',
            sendgrid: {
              apiKey,
              sandboxMode: true,
              host: StringValue.create({ value: 'HOST' }),
              ipPoolName: StringValue.create({ value: 'IP_POOL_NAME' }),
            },
          },
          invitationMessage: emailTmpl,
          oneTimePasswordMessage: emailMsg,
          resetPasswordMessage: emailMsg,
          verificationMessage: emailMsg,
        },
      };

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

    const resp = await sdk.readEmailServiceConfiguration(objectId);

    const expectedEmailMsg = {
      to: [TEST_TO_EMAIL],
      subject: 'subject',
      cc: [],
      bcc: [],
      textContent: 'Text Email Content',
      from: {
        address: 'user@example.com',
        name: 'User',
      },
      replyTo: {
        address: 'anotherUser@example.com',
        name: 'Another User',
      },
    };
    const expectedEmailTmpl = {
      templateId,
      to: [TEST_TO_EMAIL],
      subject: 'subject',
      cc: [],
      bcc: [],
      headers: {},
      substitutions: {},
      customArgs: {},
      dynamicTemplateValues: {},
      categories: [],
      attachments: [],
      templateArn: 'Template ARN',
      eventPayload: 'Event Payload',
      templateVersion: 'Template Version',
    };

    const expectedResp = {
      id: objectId,
      name: mockResp.configNode?.name,
      apiKey,
      sandboxMode: true,
      host: { value: 'HOST' },
      ipPoolName: { value: 'IP_POOL_NAME' },
      oneTimePasswordMessage: expectedEmailMsg,
      invitationMessage: expectedEmailTmpl,
      resetPasswordMessage: expectedEmailMsg,
      verificationMessage: expectedEmailMsg,
      displayName: '',
      etag: mockResp.configNode?.etag,
      customerId: mockResp.configNode?.customerId,
      appSpaceId: mockResp.configNode?.appSpaceId,
      tenantId: mockResp.configNode?.tenantId,
      createTime: Utils.timestampToDate(mockResp.configNode?.createTime),
      updateTime: Utils.timestampToDate(mockResp.configNode?.updateTime),
    };

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedResp);
  });

  it('Read (html) - Success', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    const emailMsg = {
      email: {
        oneofKind: 'message',
        message: {
          to: [TEST_TO_EMAIL],
          cc: [],
          bcc: [],
          from: {
            address: 'user@example.com',
            name: 'User',
          },
          replyTo: {
            address: 'anotherUser@example.com',
            name: 'Another User',
          },
          subject: 'subject',
          htmlContent: '<span>Text Email Content</span>',
          textContent: '',
          headers: {},
          customArgs: {},
          dynamicTemplateValues: {},
          attachments: [],
          categories: [],
        },
      },
    } as EmailDefinition;
    const emailTmpl = {
      email: {
        oneofKind: 'template',
        template: {
          templateId,
          headers: {},
          substitutions: {},
          attachments: [],
          categories: [],
          customArgs: {},
          dynamicTemplateValues: {},
          templateArn: 'Template ARN',
          to: [TEST_TO_EMAIL],
          cc: [],
          bcc: [],
          subject: 'subject',
        },
      },
    } as EmailDefinition;

    if (mockResp.configNode)
      mockResp.configNode.config = {
        oneofKind: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
          provider: {
            oneofKind: 'sendgrid',
            sendgrid: {
              apiKey,
              sandboxMode: true,
              host: StringValue.create({ value: 'HOST' }),
              ipPoolName: StringValue.create({ value: 'IP_POOL_NAME' }),
            },
          },
          invitationMessage: emailTmpl,
          oneTimePasswordMessage: emailMsg,
          resetPasswordMessage: emailMsg,
          verificationMessage: emailMsg,
        },
      };

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

    const resp = await sdk.readEmailServiceConfiguration(objectId);

    const expectedEmailMsg = {
      to: [TEST_TO_EMAIL],
      subject: 'subject',
      cc: [],
      bcc: [],
      htmlContent: '<span>Text Email Content</span>',
      from: {
        address: 'user@example.com',
        name: 'User',
      },
      replyTo: {
        address: 'anotherUser@example.com',
        name: 'Another User',
      },
    };
    const expectedEmailTmpl = {
      templateId,
      to: [TEST_TO_EMAIL],
      subject: 'subject',
      cc: [],
      bcc: [],
      headers: {},
      substitutions: {},
      customArgs: {},
      dynamicTemplateValues: {},
      categories: [],
      attachments: [],
      templateArn: 'Template ARN',
    };

    const expectedResp = {
      id: objectId,
      name: mockResp.configNode?.name,
      apiKey,
      sandboxMode: true,
      host: { value: 'HOST' },
      ipPoolName: { value: 'IP_POOL_NAME' },
      oneTimePasswordMessage: expectedEmailMsg,
      invitationMessage: expectedEmailTmpl,
      resetPasswordMessage: expectedEmailMsg,
      verificationMessage: expectedEmailMsg,
      displayName: '',
      etag: mockResp.configNode?.etag,
      customerId: mockResp.configNode?.customerId,
      appSpaceId: mockResp.configNode?.appSpaceId,
      tenantId: mockResp.configNode?.tenantId,
      createTime: Utils.timestampToDate(mockResp.configNode?.createTime),
      updateTime: Utils.timestampToDate(mockResp.configNode?.updateTime),
    };

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedResp);
  });

  it('Read - Missing config node', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({});
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

    const resp = sdk.readEmailServiceConfiguration(objectId);

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty('message', 'config_error_read_emailconfiguration');
  });

  it('Read - Unsupported Provider', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    if (mockResp.configNode)
      mockResp.configNode.config = {
        oneofKind: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
          provider: {
            oneofKind: 'mailjet', // unsupported yet
            mailjet: {
              apiKey,
              sandboxMode: true,
              urlTags: {},
            },
          },
        },
      };

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
      await sdk.readEmailServiceConfiguration(objectId);
      expect(true).toEqual(false);
    } catch (error) {
      const e = error as SdkError;
      expect(e.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(e.message).toBe('mailjet provider is not support yet');
    }

    expect(mockFunc).toBeCalled();
  });

  it('Read - Missing Provider', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new Date().toISOString(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    if (mockResp.configNode)
      mockResp.configNode.config = {
        oneofKind: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
        } as EmailServiceConfig,
      };

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
      await sdk.readEmailServiceConfiguration(objectId);
      expect(true).toEqual(false);
    } catch (error) {
      const e = error as SdkError;
      expect(e.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(e.message).toBe("Can't build Email Provider: undefined");
    }
    expect(mockFunc).toBeCalled();
  });

  it('Update', async () => {
    const sendgrid = createSendgridObject(false);
    sendgrid.id = v4();

    const mockResp = UpdateConfigNodeResponse.fromJson({
      id: sendgrid.id,
      updateTime: new Date().toISOString(),
      bookmark: 'bookmark-token',
    });

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

    const resp = await sdk.updateEmailServiceConfiguration(sendgrid);

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(sendgrid);
  });

  it('Update - All configurations', async () => {
    const sendgrid = createSendgridObject(false);
    sendgrid.id = v4();
    sendgrid.etag = 'eTag';
    sendgrid.displayName = 'My Sendgrid';

    const mockResp = UpdateConfigNodeResponse.fromJson({
      id: sendgrid.id,
      etag: sendgrid.etag,
      updateTime: new Date().toISOString(),
      bookmark: 'bookmark-token',
    });

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

    const resp = await sdk.updateEmailServiceConfiguration(sendgrid);

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(sendgrid);
  });

  it('Update - Incorrect id', async () => {
    const sendgrid = createSendgridObject(false);
    sendgrid.id = v4();

    const mockResp = UpdateConfigNodeResponse.fromJson({
      id: 'incorrect-id',
      updateTime: new Date().toISOString(),
    });

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

    const resp = sdk.updateEmailServiceConfiguration(sendgrid);

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty(
      'message',
      `Update returned with different id: req.iq=${sendgrid.id}, res.id=${mockResp.id}`,
    );
  });

  it('Update - Error', async () => {
    const sendgrid = createSendgridObject(false);
    sendgrid.id = v4();

    const mockError = { message: 'Update error' } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(mockError, {} as UpdateConfigNodeResponse);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);

    const resp = sdk.updateEmailServiceConfiguration(sendgrid);

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(mockError);
  });

  it('Update - No response', async () => {
    const sendgrid = createSendgridObject(false);
    sendgrid.id = v4();

    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') callback(null, {} as UpdateConfigNodeResponse);
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);

    const resp = sdk.updateEmailServiceConfiguration(sendgrid);

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty(
      'message',
      `Update returned with different id: req.iq=${sendgrid.id}, res.id=undefined`,
    );
  });

  it('Delete - True', async () => {
    const sendgrid = createSendgridObject();
    sendgrid.id = v4();

    const mockResp = DeleteConfigNodeResponse.fromJson({});
    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        expect(request).toEqual({ id: sendgrid.id, etag: undefined, bookmarks: [] });
        if (typeof callback === 'function') callback(null, mockResp);
        return {} as ClientUnaryCall;
      },
    );

    jest.spyOn(sdk['client'], 'deleteConfigNode').mockImplementation(mockFunc);
    const respTrue = sdk.deleteEmailServiceConfiguration(sendgrid);
    expect(mockFunc).toBeCalled();
    expect(respTrue).resolves.toEqual(true);
  });

  it('Delete - False', async () => {
    const sendgrid = createSendgridObject();
    sendgrid.id = v4();
    sendgrid.etag = 'eTag';

    const mockResp = DeleteConfigNodeResponse.fromJson({});
    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        expect(request).toEqual({ id: sendgrid.id, etag: { value: sendgrid.etag }, bookmarks: [] });
        if (typeof callback === 'function') {
          callback(
            { code: Status.NOT_FOUND, details: 'no details', metadata: {} } as ServiceError,
            mockResp,
          );
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'deleteConfigNode').mockImplementation(mockFunc);
    const respFalse = sdk.deleteEmailServiceConfiguration(sendgrid);
    expect(mockFunc).toBeCalled();
    expect(respFalse).rejects.toEqual(false);
  });

  it('Create auth flow configuration - Error', async () => {
    const mockResp = CreateConfigNodeResponse.fromJson({});
    const mockError = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: CreateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: CreateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') {
          callback(mockError, mockResp);
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'createConfigNode').mockImplementation(mockFunc);
    const resp = sdk.createAuthflowConfiguration('location', {
      marshal: () => ({} as AuthFlowConfig),
      name: 'name',
    } as AuthFlow);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(mockError);
  });

  it('Read auth flow configuration - Error', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({});
    const mockError = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') {
          callback(mockError, mockResp);
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);
    const resp = sdk.readAuthflowConfiguration('id');
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(mockError);
  });

  it('Read - Missing config node', async () => {
    const mockResp = ReadConfigNodeResponse.fromJson({});
    const mockFunc = jest.fn(
      (
        request: ReadConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: ReadConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        if (typeof callback === 'function') {
          callback(null, mockResp);
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'readConfigNode').mockImplementation(mockFunc);
    const resp = sdk.readAuthflowConfiguration('id');

    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty('message', 'config_error_read_authflowconfiguration');
  });

  it('Update auth flow configuration - Error', async () => {
    const config = {} as AuthFlow;
    config.displayName = 'Display Name';
    config.marshal = () => ({} as AuthFlowConfig);
    const mockResp = UpdateConfigNodeResponse.fromJson({});
    const mockError = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        expect(request.displayName).toEqual({ value: config.displayName });
        if (typeof callback === 'function') {
          callback(mockError, mockResp);
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);
    const resp = sdk.updateAuthflowConfiguration(config);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(mockError);
  });

  it('Update auth flow configuration - Incorrect id', async () => {
    const config = {} as AuthFlow;
    config.id = '42';
    config.displayName = 'Display Name';
    config.marshal = () => ({} as AuthFlowConfig);
    const mockResp = UpdateConfigNodeResponse.fromJson({
      id: 'incorrect-id',
    });
    const mockFunc = jest.fn(
      (
        request: UpdateConfigNodeRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: UpdateConfigNodeResponse) => void),
      ): ClientUnaryCall => {
        expect(request.displayName).toEqual({ value: config.displayName });
        if (typeof callback === 'function') {
          callback(null, mockResp);
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'updateConfigNode').mockImplementation(mockFunc);
    const resp = sdk.updateAuthflowConfiguration(config);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toHaveProperty(
      'message',
      `Update returned with different id: req.iq=${config.id}, res.id=${mockResp.id}`,
    );
  });

  it('Delete auth flow configuration - Error', async () => {
    const config = {} as AuthFlow;
    config.etag = 'eTag';
    const mockError = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback: Metadata | CallOptions | ((error: ServiceError | null) => void),
      ): ClientUnaryCall => {
        expect(request.etag).toEqual({ value: config.etag });
        if (typeof callback === 'function') {
          callback(mockError);
        }
        return {} as ClientUnaryCall;
      },
    );
    jest.spyOn(sdk['client'], 'deleteConfigNode').mockImplementation(mockFunc);
    const resp = sdk.deleteAuthflowConfiguration(config);
    expect(mockFunc).toBeCalled();
    expect(resp).rejects.toEqual(false);
  });
});
