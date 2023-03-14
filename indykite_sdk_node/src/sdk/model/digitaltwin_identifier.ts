import { DigitalTwinIdentifier as DigitalTwinIdentifierModel } from '../../grpc/indykite/identity/v1beta2/model';
import { Utils } from '../utils/utils';
import { DigitalTwinCore } from './digitaltwin';
import { PropertyFilter } from './property_filter';

/**
 * @since 0.2.2
 */
export abstract class DigitalTwinIdentifier {
  /**
   * Create the instance from the Digital Twin instance
   * @since 0.2.2
   * @param dt The Digital Twin instance
   */
  static fromDigitalTwin(dt: DigitalTwinCore): DigitalTwinCoreIdentifier {
    return new DigitalTwinCoreIdentifier(dt);
  }

  /**
   * Create the instance from the property filter
   * @since 0.2.2
   * @param propertyFilter The property filter instance
   */
  static fromPropertyFilter(propertyFilter: PropertyFilter): DigitalTwinPropertyFilterIdentifier {
    return new DigitalTwinPropertyFilterIdentifier(propertyFilter);
  }

  /**
   * Create the instance from the access token
   * @since 0.2.2
   * @param token The access token
   */
  static fromToken(token: string): DigitalTwinTokenIdentifier {
    return new DigitalTwinTokenIdentifier(token);
  }

  /**
   * Transform to the gRPC object
   * @since 0.2.2
   */
  abstract marshal(): DigitalTwinIdentifierModel;
}

/**
 * @since 0.2.2
 */
export class DigitalTwinCoreIdentifier extends DigitalTwinIdentifier {
  /**
   * @since 0.2.2
   */
  constructor(public dt: DigitalTwinCore) {
    super();
  }

  /**
   * Transform to the gRPC object
   * @since 0.2.2
   */
  marshal(): DigitalTwinIdentifierModel {
    return {
      filter: {
        oneofKind: 'digitalTwin',
        digitalTwin: this.dt.marshal(),
      },
    };
  }
}

/**
 * @since 0.2.2
 */
export class DigitalTwinPropertyFilterIdentifier extends DigitalTwinIdentifier {
  /**
   * @since 0.2.2
   */
  constructor(public propertyFilter: PropertyFilter) {
    super();
  }

  /**
   * Transform to the gRPC object
   * @since 0.2.2
   */
  marshal(): DigitalTwinIdentifierModel {
    return {
      filter: {
        oneofKind: 'propertyFilter',
        propertyFilter: {
          ...this.propertyFilter,
          value: Utils.objectToValue(this.propertyFilter.value),
        },
      },
    };
  }
}

/**
 * @since 0.2.2
 */
export class DigitalTwinTokenIdentifier extends DigitalTwinIdentifier {
  /**
   * @since 0.2.2
   */
  constructor(public token: string) {
    super();
  }

  /**
   * Transform to the gRPC object
   * @since 0.2.2
   */
  marshal(): DigitalTwinIdentifierModel {
    return {
      filter: {
        oneofKind: 'accessToken',
        accessToken: this.token,
      },
    };
  }
}
