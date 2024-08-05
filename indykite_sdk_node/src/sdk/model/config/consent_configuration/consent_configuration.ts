import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  ConsentConfiguration,
  ExternalTokenStatus,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { ConfigNode } from '../config_node';

type IOptions = {
  purpose: string;
  dataPoints: string[];
  applicationId: string;
  name: string;
  displayName?: string;
  description?: StringValue;
  validityPeriod: string;
  revokeAfterUse: boolean;
  tokenStatus: ExternalTokenStatus;
};

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.ConsentConfiguration
 */
export class ConsentNode extends ConfigNode {
  public purpose: string;
  public dataPoints: string[];
  public applicationId: string;
  public validityPeriod: string;
  public revokeAfterUse: boolean;
  public tokenStatus: ExternalTokenStatus;

  constructor(options: IOptions) {
    super(options.name);

    this.displayName = options.displayName;
    this.description = options.description;
    this.purpose = options.purpose;
    this.dataPoints = options.dataPoints;
    this.applicationId = options.applicationId;
    this.validityPeriod = options.validityPeriod;
    this.revokeAfterUse = options.revokeAfterUse;
    this.tokenStatus = options.tokenStatus;
  }

  marshal(): ConsentConfiguration {
    return {
      purpose: this.purpose,
      dataPoints: this.dataPoints,
      applicationId: this.applicationId,
      validityPeriod: this.validityPeriod,
      revokeAfterUse: this.revokeAfterUse,
      tokenStatus: this.tokenStatus,
    };
  }
}
