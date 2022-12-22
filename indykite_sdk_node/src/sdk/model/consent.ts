import { ListConsentsResponse } from '../../grpc/indykite/identity/v1beta2/identity_management_api';
import { SdkError, SdkErrorCode } from '../error';
import { Utils } from '../utils/utils';

export class PiiProcessor {
  constructor(
    public piiProcessorId: string,
    public displayName: string,
    public description: string,
    public owner: string,
    public policyUri: string,
    public termsOfServiceUri: string,
    public clientUri: string,
    public logoUri: string,
    public userSupportEmailAddress: string,
    public additionalContacts: string[],
  ) {}
}

export class PiiController {
  constructor(public piiControllerId: string, public displayName: string) {}
}

export class ConsentReceipt {
  constructor(
    public consentId: string,
    public properties: string[],
    public piiController?: PiiController,
    public consentedAt?: Date | null,
  ) {}
}

export class Consent {
  constructor(
    public piiPrincipalId: string,
    public items: ConsentReceipt[],
    public piiProcessor?: PiiProcessor,
  ) {}

  static deserialize(response: ListConsentsResponse): Consent {
    if (!response.consentReceipt) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize consent receipt.");
    }

    let piiProcessor: PiiProcessor | undefined;
    if (response.consentReceipt.piiProcessor) {
      piiProcessor = new PiiProcessor(
        response.consentReceipt.piiProcessor.piiProcessorId,
        response.consentReceipt.piiProcessor.displayName,
        response.consentReceipt.piiProcessor.description,
        response.consentReceipt.piiProcessor.owner,
        response.consentReceipt.piiProcessor.policyUri,
        response.consentReceipt.piiProcessor.termsOfServiceUri,
        response.consentReceipt.piiProcessor.clientUri,
        response.consentReceipt.piiProcessor.logoUri,
        response.consentReceipt.piiProcessor.userSupportEmailAddress,
        response.consentReceipt.piiProcessor.additionalContacts,
      );
    }

    const items =
      response.consentReceipt.items?.map((item) => {
        let piiController: PiiController | undefined;
        let consentedAt: Date | undefined;

        if (item.piiController) {
          piiController = new PiiController(
            item.piiController.piiControllerId,
            item.piiController.displayName,
          );
        }

        if (item.consentedAtTime) {
          consentedAt = Utils.timestampToDate(item.consentedAtTime);
        }

        return new ConsentReceipt(item.consentId, item.properties, piiController, consentedAt);
      }) ?? [];

    return new Consent(response.consentReceipt.piiPrincipalId ?? '', items, piiProcessor);
  }
}
