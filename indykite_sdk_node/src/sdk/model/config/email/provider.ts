import { Email, EmailServiceConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { NodeConfiguration } from '../configuration';
import { EmailMessage } from './message';
import { EmailTemplate } from './template';

export {
  SendGridProviderConfig,
  MailJetProviderConfig,
  AmazonSESProviderConfig,
  MailgunProviderConfig,
  Email,
} from '../../../../grpc/indykite/config/v1beta1/model';

export type EmailMessageType = 'oneTimePassword' | 'invitation' | 'resetPassword' | 'verification';

export class EmailProvider extends NodeConfiguration {
  defaultFromAddress?: Email;
  oneTimePasswordMessage?: EmailMessage | EmailTemplate;
  invitationMessage?: EmailMessage | EmailTemplate;
  resetPasswordMessage?: EmailMessage | EmailTemplate;
  verificationMessage?: EmailMessage | EmailTemplate;

  constructor(name: string) {
    super(name);
  }

  marshalWithoutProvider(): Omit<EmailServiceConfig, 'provider'> {
    const svc: Partial<EmailServiceConfig> = {};
    if (this.defaultFromAddress) {
      svc.defaultFromAddress = this.defaultFromAddress;
    }
    if (this.oneTimePasswordMessage)
      svc.oneTimePasswordMessage = this.oneTimePasswordMessage.marshal();
    if (this.invitationMessage) svc.invitationMessage = this.invitationMessage.marshal();
    if (this.resetPasswordMessage) svc.resetPasswordMessage = this.resetPasswordMessage.marshal();
    if (this.verificationMessage) svc.verificationMessage = this.verificationMessage.marshal();

    return svc;
  }

  setDefaultFrom(email: Email): void {
    this.defaultFromAddress = email;
  }

  setMessage(type: EmailMessageType, email: EmailMessage | EmailTemplate): void {
    switch (type) {
      case 'oneTimePassword':
        this.oneTimePasswordMessage = email;
        break;
      case 'invitation':
        this.invitationMessage = email;
        break;
      case 'resetPassword':
        this.resetPasswordMessage = email;
        break;
      case 'verification':
        this.verificationMessage = email;
        break;
    }
  }
}
