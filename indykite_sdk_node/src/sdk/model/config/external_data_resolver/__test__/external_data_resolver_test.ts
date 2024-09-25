import {
  ExternalDataResolver,
  ExternalDataResolverConfig_ContentType,
} from '../external_data_resolver';

describe('when the instance is created', () => {
  let client: ExternalDataResolver;
  const encoder = new TextEncoder();
  const payload = encoder.encode(JSON.stringify({ key: 'value' }));

  beforeEach(() => {
    client = new ExternalDataResolver({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: { value: 'Instance description' },
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
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
    expect(client.url).toBe('https://example.com/source2');
    expect(client.method).toBe('POST');
    expect(client.headers['Authentication']).toBe({ values: ['Bearer edolkUTY'] });
    expect(client.requestType).toBe(ExternalDataResolverConfig_ContentType.CONTENT_TYPE_JSON);
    expect(client.requestPayload).toBe(payload);
    expect(client.responseType).toBe(ExternalDataResolverConfig_ContentType.CONTENT_TYPE_JSON);
    expect(client.responseSelector).toBe('.');
  });
});
