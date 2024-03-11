import { v4 } from 'uuid';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { generateRandomGID } from '../../utils/test_utils';
import { DigitalTwin, DigitalTwinCore } from '../digitaltwin';

describe('properties', () => {
  const dtId = generateRandomGID();
  const tenantId = generateRandomGID();

  it('deserialize core', () => {
    expect(
      DigitalTwinCore.deserializeCore({
        id: dtId,
        tenantId,
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: ['tag-id'],
      }),
    ).toEqual(
      new DigitalTwinCore(dtId, tenantId, DigitalTwinKind.PERSON, DigitalTwinState.ACTIVE, [
        'tag-id',
      ]),
    );
  });
});

describe('when `fromModel` method is used for the instance creation', () => {
  const id = v4();
  const tenantId = v4();
  let instance: DigitalTwinCore;

  beforeEach(() => {
    instance = DigitalTwin.fromModel({
      id,
      tenantId,
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
      tags: [],
    });
  });

  it('creates a correct instance', () => {
    expect(instance.id).toBe(id);
    expect(instance.tenantId).toBe(tenantId);
    expect(instance.kind).toBe(DigitalTwinKind.PERSON);
    expect(instance.state).toBe(DigitalTwinState.ACTIVE);
  });

  it('marshals the instance correctly', () => {
    expect(instance.marshal()).toEqual({
      id,
      tenantId,
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
      tags: [],
    });
  });
});
