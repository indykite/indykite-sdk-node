import * as grpc from '../../../../grpc/indykite/config/v1beta1/model';
import * as grpcStruct from '../../../../grpc/indykite/objects/v1beta1/struct';
import { Email } from './provider';

export class EmailMessage {
  from: Email | undefined;
  replyTo: Email | undefined;
  // to: Email[];
  cc: Email[] = [];
  bcc: Email[] = [];
  // subject: string;
  textContent: string | undefined;
  htmlContent: string | undefined;
  headers: { [key: string]: string } | undefined;
  customArgs: { [key: string]: string } | undefined;
  dynamicTemplateValues: { [key: string]: grpcStruct.Value } | undefined;
  categories: string[] | undefined;
  attachments: grpc.EmailAttachment[] | undefined;

  constructor(public to: Email[], public subject: string) {}

  withTextContent(text: string): EmailMessage {
    this.textContent = text;
    this.htmlContent = undefined;
    return this;
  }

  withHtmlContent(html: string): EmailMessage {
    this.htmlContent = html;
    this.textContent = undefined;
    return this;
  }

  marshal(): grpc.EmailDefinition {
    const msg = {
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject,
      from: this.from,
      replyTo: this.replyTo,
      textContent: this.textContent,
      htmlContent: this.htmlContent,
    } as grpc.EmailMessage;
    return {
      email: {
        oneofKind: 'message',
        message: msg,
      },
    };
  }
}
