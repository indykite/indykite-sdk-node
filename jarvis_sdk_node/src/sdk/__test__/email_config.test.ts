import { ServiceError } from '@grpc/grpc-js';
import { ClientUnaryCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { Metadata } from '@grpc/grpc-js/build/src/metadata';
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
import { EmailDefinition } from '../../grpc/indykite/config/v1beta1/model';
import { ConfigClient } from '../config';
import { SdkError, SdkErrorCode } from '../error';
import { EmailMessage, SendgridEmailProvider } from '../model';
import { EmailTemplate } from '../model/config/email/template';

let sdk: ConfigClient;

const userToken = 'USER_TOKEN';
const TEST_TO_EMAIL = { address: 'test+to@indykite.com', name: 'Test To' };

beforeAll(async () => {
  process.env.JARVIS_ENDPOINT = 'NOT_USED';
  sdk = await ConfigClient.createInstance(userToken);
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
    sendgrid.setMessage('authentication', emailMsg);
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

    const resp = await sdk.createEmailServiceConfiguration(
      'gid:KAEyEGluZHlraURlgAAAAAAAAA8',
      createSendgridObject(),
    );

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual({ ...mockResp });
  });
});

describe('Read, Update, Delete - Email Configuration', () => {
  const apiKey = v4();
  const objectId = 'gid:ChBpbmR5a2lEZYAAAAAAAAAPKAgyECQ5IfNE10V1hFzMR_8ZeP4';
  const templateId = v4();

  it('Read - Success', async () => {
    const mockResp = ReadConfigNodeResponse.fromJSON({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new String(Date.now()),
        createTime: new Date(),
        updateTime: new Date(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    const emailMsg = {
      email: {
        $case: 'message',
        message: {
          to: [TEST_TO_EMAIL],
          cc: [],
          bcc: [],
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
        $case: 'template',
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
        $case: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
          provider: {
            $case: 'sendgrid',
            sendgrid: {
              apiKey,
              sandboxMode: true,
              host: 'HOST',
              ipPoolName: 'IP_POOL_NAME',
            },
          },
          invitationMessage: emailTmpl,
          authenticationMessage: emailMsg,
          resetPasswordMessage: emailMsg,
          verificationMessage: emailMsg,
        },
      };

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

    const resp = await sdk.readEmailServiceConfiguration(objectId);

    const expectedEmailMsg = {
      to: [TEST_TO_EMAIL],
      subject: 'subject',
      cc: [],
      bcc: [],
      textContent: 'Text Email Content',
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
      host: 'HOST',
      ipPoolName: 'IP_POOL_NAME',
      authenticationMessage: expectedEmailMsg,
      invitationMessage: expectedEmailTmpl,
      resetPasswordMessage: expectedEmailMsg,
      verificationMessage: expectedEmailMsg,
      displayName: '',
      etag: mockResp.configNode?.etag,
      customerId: mockResp.configNode?.customerId,
      appSpaceId: mockResp.configNode?.appSpaceId,
      tenantId: mockResp.configNode?.tenantId,
      createTime: mockResp.configNode?.createTime,
      updateTime: mockResp.configNode?.updateTime,
    };

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(expectedResp);
  });

  it('Read - Unsupported Provider', async () => {
    const mockResp = ReadConfigNodeResponse.fromJSON({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new String(Date.now()),
        createTime: new Date(),
        updateTime: new Date(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    if (mockResp.configNode)
      mockResp.configNode.config = {
        $case: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
          provider: {
            $case: 'mailjet', // unsupported yet
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
    const mockResp = ReadConfigNodeResponse.fromJSON({
      configNode: {
        name: 'Email Configuration',
        displayName: '',
        id: objectId,
        etag: new String(Date.now()),
        createTime: new Date(),
        updateTime: new Date(),
        customerId: v4(),
        appSpaceId: '',
        tenantId: '',
      },
    });
    if (mockResp.configNode)
      mockResp.configNode.config = {
        $case: 'emailServiceConfig',
        emailServiceConfig: {
          defaultFromAddress: TEST_TO_EMAIL,
        },
      };

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

    const mockResp = UpdateConfigNodeResponse.fromJSON({
      id: sendgrid.id,
      etag: sendgrid.etag,
      updateTime: new Date(),
    });

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

    const resp = await sdk.updateEmailServiceConfiguration(sendgrid);

    expect(mockFunc).toBeCalled();
    expect(resp).toEqual(sendgrid);
  });

  it('Delete - True', async () => {
    const sendgrid = createSendgridObject();
    sendgrid.id = v4();

    const mockResp = DeleteConfigNodeResponse.fromJSON({});
    const mockFunc = jest.fn(
      (
        request: DeleteConfigNodeRequest,
        callback:
          | Metadata
          | ((error: ServiceError | null, response: DeleteConfigNodeResponse) => void),
      ): ClientUnaryCall => {
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

    const mockResp = DeleteConfigNodeResponse.fromJSON({});
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
});
