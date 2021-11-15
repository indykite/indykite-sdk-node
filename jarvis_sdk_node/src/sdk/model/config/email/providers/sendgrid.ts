import {
  EmailServiceConfig,
  SendGridProviderConfig,
} from '../../../../../grpc/indykite/config/v1beta1/model';
import { EmailProvider } from '../provider';

export class SendgridEmailProvider extends EmailProvider implements SendGridProviderConfig {
  apiKey: string;
  sandboxMode: boolean;
  ipPoolName?: string | undefined;
  host?: string | undefined;

  constructor(name: string, apiKey: string, sandboxMode: boolean) {
    super(name);
    this.apiKey = apiKey;
    this.sandboxMode = sandboxMode;
  }

  marshal(): EmailServiceConfig {
    const emailService = super.marshal();

    emailService.provider = {
      $case: 'sendgrid',
      sendgrid: {
        apiKey: this.apiKey,
        sandboxMode: this.sandboxMode,
        ipPoolName: this.ipPoolName,
        host: this.host,
      },
    };

    return emailService;
  }
}
