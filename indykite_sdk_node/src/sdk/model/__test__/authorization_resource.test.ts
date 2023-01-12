import { AuthorizationResource } from '../authorization_resource';

describe('when a new auth resource instance is created', () => {
  const id = 'mocked-id';
  const label = 'mocked-label';
  let instance: AuthorizationResource;

  beforeEach(() => {
    instance = new AuthorizationResource(id, label);
  });

  it('creates a correct object', () => {
    expect(instance.id).toBe(id);
    expect(instance.label).toBe(label);
  });
});
