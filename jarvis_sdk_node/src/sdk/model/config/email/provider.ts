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

export type EmailMessageType = 'authentication' | 'invitation' | 'resetPassword' | 'verification';

export class EmailProvider extends NodeConfiguration {
  defaultFromAddress?: Email;
  authenticationMessage?: EmailMessage | EmailTemplate;
  invitationMessage?: EmailMessage | EmailTemplate;
  resetPasswordMessage?: EmailMessage | EmailTemplate;
  verificationMessage?: EmailMessage | EmailTemplate;

  constructor(name: string) {
    super(name);
  }

  marshal(): EmailServiceConfig {
    const svc: EmailServiceConfig = {
      defaultFromAddress: this.defaultFromAddress,
    };
    if (this.authenticationMessage)
      svc.authenticationMessage = this.authenticationMessage.marshal();
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
      case 'authentication':
        this.authenticationMessage = email;
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
