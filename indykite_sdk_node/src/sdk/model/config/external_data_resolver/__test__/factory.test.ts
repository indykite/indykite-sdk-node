import { ExternalDataResolverFactory } from '../factory';
import { ExternalDataResolver } from '../external_data_resolver';

describe('createInstance', () => {
  let client: ExternalDataResolver;
  const encoder = new TextEncoder();
  const payload = encoder.encode(JSON.stringify({ key: 'value' }));

  beforeEach(() => {
    client = ExternalDataResolverFactory.createInstance('instance-name', {
      url: 'https://example.com/source2',
      method: 'POST',
      headers: {
        Authorization: { values: ['Bearer edolkUTY'] },
        'Content-Type': { values: ['application/json'] },
      },
      requestType: 1,
      requestPayload: payload,
      responseType: 1,
      responseSelector: '.',
    });
  });

  it('creates a correct instance', () => {
    expect(client).toEqual(new ExternalDataResolver(client));
  });
});
