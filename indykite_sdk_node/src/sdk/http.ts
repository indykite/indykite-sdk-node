import { get as httpsGet, request as httpsRequest } from 'https';
import { TokenSource } from './utils/token_source/token_source';

export interface HTTPResponse {
  body: string;
  status: string;
  statusCode: number;
}

/**
 * This HTTP client returns an authenticated HTTP client that always injects a valid token.
 * @since 0.2.3
 */
export class HTTPClient {
  private tokenSource: TokenSource;

  private constructor(appCredential?: string | unknown) {
    this.tokenSource = TokenSource.reuseApplicationTokenSource(undefined, appCredential);
  }

  /**
   * Create new HTTPClient instance.
   * @since 0.2.3
   * @example
   * HTTPClient.createInstance().then(async (client) => {
   *   const x = await client.post(
   *     'https://jarvis.indykite.com/knowledge/gid:appSpaceGid',
   *     'application/json',
   *     '{"query":"query ExampleQuery { identityProperties { id }}","variables":{},"operationName":"ExampleQuery"}',
   *   );
   *
   *   console.log(JSON.stringify(x, null, 2));
   * });
   */
  static createInstance(appCredential?: string | unknown): Promise<HTTPClient> {
    return Promise.resolve(new HTTPClient(appCredential));
  }

  /**
   * Get a token source for generating authorization header.
   * @since 0.2.3
   * @example
   * const tokenSource = HTTPClient.getTokenSource();
   * const token = await tokenSource.getApplicationToken();
   * console.log(JSON.stringify(token, null, 2));
   * const accessToken = token.accessToken;
   */
  static getTokenSource(): TokenSource {
    return TokenSource.reuseApplicationTokenSource();
  }

  /**
   * Send a GET request with the authorization header.
   * @since 0.2.3
   */
  async get(url: string): Promise<HTTPResponse> {
    const token = await this.getToken();
    return new Promise((resolve, reject) => {
      const chunks: string[] = [];
      httpsGet(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'GET',
        },
        (res) => {
          res.on('data', (data) => {
            chunks.push(data);
          });
          res.on('end', () => {
            resolve({
              body: chunks.join(''),
              status: res.statusMessage ?? 'Unknown',
              statusCode: res.statusCode ?? 0,
            });
          });
          res.on('error', (err) => {
            reject(err);
          });
        },
      );
    });
  }

  /**
   * Send a POST request with the authorization header.
   * @since 0.2.3
   * @example
   * HTTPClient.createInstance().then(async (client) => {
   *   const x = await client.post(
   *     'https://jarvis.indykite.com/knowledge/gid:appSpaceGid',
   *     'application/json',
   *     '{"query":"query ExampleQuery { identityProperties { id }}","variables":{},"operationName":"ExampleQuery"}',
   *   );
   *
   *   console.log(JSON.stringify(x, null, 2));
   * });
   */
  async post(url: string, contentType: string, body: string): Promise<HTTPResponse> {
    const token = await this.getToken();
    return new Promise((resolve, reject) => {
      const chunks: string[] = [];
      const req = httpsRequest(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': contentType,
          },
          method: 'POST',
        },
        (res) => {
          res.on('data', (data) => {
            chunks.push(data);
          });
          res.on('end', () => {
            resolve({
              body: chunks.join(''),
              status: res.statusMessage ?? 'Unknown',
              statusCode: res.statusCode ?? 0,
            });
          });
          res.on('error', (err) => {
            reject(err);
          });
        },
      );
      req.write(body);
      req.end();
    });
  }

  private async getToken(): Promise<string> {
    const token = await this.tokenSource.getApplicationToken();
    return token.accessToken;
  }
}
