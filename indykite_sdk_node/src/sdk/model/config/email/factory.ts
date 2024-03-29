import * as grpc from '../../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SdkError } from '../../../error';
import { EmailMessage } from './message';
import { EmailService } from './service';
import { SendgridEmailService } from './providers/sendgrid';
import { EmailTemplate } from './template';

export class EmailServiceConfigType extends SendgridEmailService {}
export const EMAIL_SERVICE_CONFIG = 'emailServiceConfig';

type EmailDefinitionType =
  | { oneofKind: 'template'; template: EmailTemplate }
  | { oneofKind: 'message'; message: EmailMessage };

export class EmailServiceFactory {
  private static createMessageOrTemplate(def: EmailDefinitionType): EmailMessage | EmailTemplate {
    if (def.oneofKind === 'message') {
      const e = def.message;
      const msg = new EmailMessage(e.to, e.subject);
      msg.bcc = e.bcc;
      msg.cc = e.cc;
      if (e.textContent) msg.textContent = e.textContent;
      if (e.htmlContent) msg.htmlContent = e.htmlContent;
      if (e.from) msg.from = e.from;
      if (e.replyTo) msg.replyTo = e.replyTo;
      return msg;
    } else {
      const t = def.template as grpc.EmailTemplate;
      const msg = new EmailTemplate(t.templateId, t.to, t.subject);
      msg.customArgs = t.customArgs;
      msg.dynamicTemplateValues = t.dynamicTemplateValues;
      msg.headers = t.headers;
      msg.templateArn = t.templateArn;
      msg.bcc = t.bcc;
      msg.cc = t.cc;
      msg.from = t.from;
      msg.replyTo = t.replyTo;
      msg.eventPayload = t.eventPayload ? t.eventPayload.value : undefined;
      msg.templateVersion = t.templateVersion ? t.templateVersion.value : undefined;
      return msg;
    }
  }

  static createInstance(name: string, provider: grpc.EmailServiceConfig): EmailServiceConfigType {
    const messages = {} as EmailService;
    if (provider.oneTimePasswordMessage?.email)
      messages.oneTimePasswordMessage = EmailServiceFactory.createMessageOrTemplate(
        provider.oneTimePasswordMessage.email as EmailDefinitionType,
      );
    if (provider.invitationMessage?.email)
      messages.invitationMessage = EmailServiceFactory.createMessageOrTemplate(
        provider.invitationMessage.email as EmailDefinitionType,
      );
    if (provider.resetPasswordMessage?.email)
      messages.resetPasswordMessage = EmailServiceFactory.createMessageOrTemplate(
        provider.resetPasswordMessage.email as EmailDefinitionType,
      );
    if (provider.verificationMessage?.email)
      messages.verificationMessage = EmailServiceFactory.createMessageOrTemplate(
        provider.verificationMessage.email as EmailDefinitionType,
      );

    if (provider.provider) {
      switch (provider.provider.oneofKind) {
        case 'sendgrid': {
          const s = provider.provider.sendgrid;
          const sendgrid = new SendgridEmailService(name, s.apiKey, s.sandboxMode);
          sendgrid.host = s.host;
          sendgrid.ipPoolName = s.ipPoolName;

          return Object.assign(sendgrid, messages);
        }

        default:
          throw new SdkError(
            SdkErrorCode.SDK_CODE_1,
            `${provider.provider.oneofKind} provider is not support yet`,
          );
      }
    }
    throw new SdkError(SdkErrorCode.SDK_CODE_1, `Can't build Email Provider: ${provider.provider}`);
  }
}
