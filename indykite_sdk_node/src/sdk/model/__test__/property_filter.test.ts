import { generateRandomGID } from './../../utils/test_utils';
import { PropertyFilter } from '../property_filter';

describe('when a new instance is created', () => {
  const type = 'mocked-type';
  const value = 'mocked-value';
  const tenantId = generateRandomGID();
  let instance: PropertyFilter;

  beforeEach(() => {
    instance = new PropertyFilter(type, value, tenantId);
  });

  it('creates a correct object', () => {
    expect(instance.type).toBe(type);
    expect(instance.value).toBe(value);
    expect(instance.tenantId).toBe(tenantId);
  });
});
