import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import * as grpc from '../../../../grpc/indykite/config/v1beta1/model';
import { Value } from '../../../../grpc/indykite/objects/v1beta1/struct';
import { Email } from './provider';

export class EmailTemplate {
  // templateId: string;
  templateVersion?: string;
  from?: Email;
  replyTo?: Email;
  // to: Email[];
  cc: Email[] = [];
  bcc: Email[] = [];
  // subject: string;
  headers: { [key: string]: string } = {};
  substitutions: { [key: string]: string } = {};
  customArgs: { [key: string]: string } = {};
  dynamicTemplateValues: { [key: string]: Value } = {};
  categories: string[] = [];
  attachments: grpc.EmailAttachment[] = [];
  eventPayload?: string;
  /** The Amazon Resource Name (ARN) of the template. */
  templateArn: string;

  constructor(public templateId: string, public to: Email[], public subject: string) {
    this.templateArn = '';
  }

  marshal(): grpc.EmailDefinition {
    const tmpl = {
      templateId: this.templateId,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      headers: this.headers,
      customArgs: this.customArgs,
      dynamicTemplateValues: this.dynamicTemplateValues,
      categories: this.categories,
      attachments: this.attachments,
      templateArn: this.templateArn,
      subject: this.subject,
    } as grpc.EmailTemplate;
    tmpl.from = this.from;
    tmpl.replyTo = this.replyTo;
    tmpl.eventPayload = this.eventPayload
      ? StringValue.create({ value: this.eventPayload })
      : undefined;

    return {
      email: {
        oneofKind: 'template',
        template: tmpl,
      },
    };
  }
}
