import { get as httpsGet, request as httpsRequest } from 'https';
import { TokenSource } from './utils/token_source/token_source';

export interface HTTPResponse {
  body: string;
  status: string;
  statusCode: number;
}

export class HTTPClient {
  private tokenSource: TokenSource;

  private constructor(appCredential?: string | unknown) {
    this.tokenSource = TokenSource.reuseApplicationTokenSource(undefined, appCredential);
  }

  static createInstance(appCredential?: string | unknown): Promise<HTTPClient> {
    return Promise.resolve(new HTTPClient(appCredential));
  }

  static getTokenSource(): TokenSource {
    return TokenSource.reuseApplicationTokenSource();
  }

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
