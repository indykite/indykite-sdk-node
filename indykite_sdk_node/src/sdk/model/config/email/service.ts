import { Email, EmailServiceConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { ConfigNode } from '../config_node';
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

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.EmailServiceConfig
 */
export class EmailService extends ConfigNode {
  defaultFromAddress?: Email;
  oneTimePasswordMessage?: EmailMessage | EmailTemplate;
  invitationMessage?: EmailMessage | EmailTemplate;
  resetPasswordMessage?: EmailMessage | EmailTemplate;
  verificationMessage?: EmailMessage | EmailTemplate;

  // Default is read only value indicating this instance is used by default.
  default?: boolean;

  constructor(name: string) {
    super(name);
  }

  marshalWithoutProvider(): Omit<EmailServiceConfig, 'provider' | 'default'> {
    const svc: Partial<EmailServiceConfig> = {};
    if (this.defaultFromAddress) {
      svc.defaultFromAddress = this.defaultFromAddress;
    }
    if (this.oneTimePasswordMessage)
      svc.oneTimePasswordMessage = this.oneTimePasswordMessage.marshal();
    if (this.invitationMessage) svc.invitationMessage = this.invitationMessage.marshal();
    if (this.resetPasswordMessage) svc.resetPasswordMessage = this.resetPasswordMessage.marshal();
    if (this.verificationMessage) svc.verificationMessage = this.verificationMessage.marshal();

    // force boolean
    this.default = !!svc.default ?? false;

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
