import * as grpc from '../../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SdkError } from '../../../error';
import { EmailMessage } from './message';
import { EmailProvider } from './provider';
import { SendgridEmailProvider } from './providers/sendgrid';
import { EmailTemplate } from './template';

export type EmailProviderType = SendgridEmailProvider;

type EmailDefinitionType =
  | { oneofKind: 'template'; template: EmailTemplate }
  | { oneofKind: 'message'; message: EmailMessage };

export class EmailProviderFactory {
  private static createMessageOrTemplate(def: EmailDefinitionType): EmailMessage | EmailTemplate {
    if (def.oneofKind === 'message') {
      const e = def.message as grpc.EmailMessage;
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

  static createInstance(name: string, provider: grpc.EmailServiceConfig): EmailProviderType {
    const messages = {} as EmailProvider;
    if (provider.authenticationMessage?.email)
      messages.authenticationMessage = EmailProviderFactory.createMessageOrTemplate(
        provider.authenticationMessage.email as EmailDefinitionType,
      );
    if (provider.invitationMessage?.email)
      messages.invitationMessage = EmailProviderFactory.createMessageOrTemplate(
        provider.invitationMessage.email as EmailDefinitionType,
      );
    if (provider.resetPasswordMessage?.email)
      messages.resetPasswordMessage = EmailProviderFactory.createMessageOrTemplate(
        provider.resetPasswordMessage.email as EmailDefinitionType,
      );
    if (provider.verificationMessage?.email)
      messages.verificationMessage = EmailProviderFactory.createMessageOrTemplate(
        provider.verificationMessage.email as EmailDefinitionType,
      );

    if (provider.provider) {
      switch (provider.provider.oneofKind) {
        case 'sendgrid': {
          const s = provider.provider.sendgrid;
          const sendgrid = new SendgridEmailProvider(name, s.apiKey, s.sandboxMode);
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
