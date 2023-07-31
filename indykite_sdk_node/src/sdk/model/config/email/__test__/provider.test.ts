import {
  SendGridProviderConfig,
  MailJetProviderConfig,
  AmazonSESProviderConfig,
  MailgunProviderConfig,
  Email,
} from '../service';
import {
  SendGridProviderConfig as OriginalSendGridProviderConfig,
  MailJetProviderConfig as OriginalMailJetProviderConfig,
  AmazonSESProviderConfig as OriginalAmazonSESProviderConfig,
  MailgunProviderConfig as OriginalMailgunProviderConfig,
  Email as OriginalEmail,
} from '../../../../../grpc/indykite/config/v1beta1/model';

describe('when SendGridProviderConfig is imported', () => {
  it('returns grpc instace', () => {
    expect(SendGridProviderConfig).toBe(OriginalSendGridProviderConfig);
  });
});

describe('when MailJetProviderConfig is imported', () => {
  it('returns grpc instace', () => {
    expect(MailJetProviderConfig).toBe(OriginalMailJetProviderConfig);
  });
});

describe('when AmazonSESProviderConfig is imported', () => {
  it('returns grpc instace', () => {
    expect(AmazonSESProviderConfig).toBe(OriginalAmazonSESProviderConfig);
  });
});

describe('when MailgunProviderConfig is imported', () => {
  it('returns grpc instace', () => {
    expect(MailgunProviderConfig).toBe(OriginalMailgunProviderConfig);
  });
});

describe('when Email is imported', () => {
  it('returns grpc instace', () => {
    expect(Email).toBe(OriginalEmail);
  });
});
