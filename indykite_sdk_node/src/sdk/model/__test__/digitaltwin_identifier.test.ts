import { generateRandomGID } from './../../utils/test_utils';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { DigitalTwinCore } from '../digitaltwin';
import {
  DigitalTwinCoreIdentifier,
  DigitalTwinIdentifier,
  DigitalTwinPropertyFilterIdentifier,
  DigitalTwinTokenIdentifier,
} from '../digitaltwin_identifier';
import { PropertyFilter } from '../property_filter';

describe('when the instance is created from a DT instance', () => {
  const dt = new DigitalTwinCore(
    generateRandomGID(),
    generateRandomGID(),
    DigitalTwinKind.PERSON,
    DigitalTwinState.ACTIVE,
    [],
  );
  let instance: DigitalTwinIdentifier;

  beforeEach(() => {
    instance = DigitalTwinIdentifier.fromDigitalTwin(dt);
  });

  it('has reference to the DT', () => {
    expect(instance).toBeInstanceOf(DigitalTwinCoreIdentifier);
    expect((instance as DigitalTwinCoreIdentifier).dt).toBe(dt);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      filter: {
        oneofKind: 'digitalTwin',
        digitalTwin: dt.marshal(),
      },
    });
  });
});

describe('when the instance is created from a property filter', () => {
  const tenantId = generateRandomGID();
  const propFilter = new PropertyFilter('mocked-type', 'mocked-value', tenantId);
  let instance: DigitalTwinIdentifier;

  beforeEach(() => {
    instance = DigitalTwinIdentifier.fromPropertyFilter(propFilter);
  });

  it('has reference to the property filter', () => {
    expect(instance).toBeInstanceOf(DigitalTwinPropertyFilterIdentifier);
    expect((instance as DigitalTwinPropertyFilterIdentifier).propertyFilter).toBe(propFilter);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      filter: {
        oneofKind: 'propertyFilter',
        propertyFilter: {
          tenantId,
          type: 'mocked-type',
          value: {
            value: {
              oneofKind: 'stringValue',
              stringValue: 'mocked-value',
            },
          },
        },
      },
    });
  });
});

describe('when the instance is created from an access token', () => {
  const accessToken = 'mocked-access-token';
  let instance: DigitalTwinIdentifier;

  beforeEach(() => {
    instance = DigitalTwinIdentifier.fromToken(accessToken);
  });

  it('has reference to the access token', () => {
    expect(instance).toBeInstanceOf(DigitalTwinTokenIdentifier);
    expect((instance as DigitalTwinTokenIdentifier).token).toBe(accessToken);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      filter: {
        oneofKind: 'accessToken',
        accessToken,
      },
    });
  });
});
