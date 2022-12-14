import { StringValue } from '../../../../../grpc/google/protobuf/wrappers';
import {
  EmailServiceConfig,
  SendGridProviderConfig,
} from '../../../../../grpc/indykite/config/v1beta1/model';
import { EmailProvider } from '../provider';

export class SendgridEmailProvider extends EmailProvider implements SendGridProviderConfig {
  apiKey: string;
  sandboxMode: boolean;
  ipPoolName?: StringValue | undefined;
  host?: StringValue | undefined;

  constructor(name: string, apiKey: string, sandboxMode: boolean) {
    super(name);
    this.apiKey = apiKey;
    this.sandboxMode = sandboxMode;
  }

  marshal(): EmailServiceConfig {
    const emailService = super.marshalWithoutProvider();

    const provider: EmailServiceConfig['provider'] = {
      oneofKind: 'sendgrid',
      sendgrid: {
        apiKey: this.apiKey,
        sandboxMode: this.sandboxMode,
        ipPoolName: this.ipPoolName,
        host: this.host,
      },
    };

    return {
      ...emailService,
      provider,
    };
  }
}
