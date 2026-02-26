import axios, { Axios, AxiosHeaders, RawAxiosRequestHeaders } from 'axios';

export type HTTPHeaders = AxiosHeaders | Partial<RawAxiosRequestHeaders>;

export class HTTPService extends Axios {
  private readonly api: Axios;
  constructor(baseURL: string, headers?: HTTPHeaders) {
    super({
      baseURL,
      headers,
    });

    this.api = axios.create({
      baseURL,
      headers,
    });

    Object.assign(this, this.api);
  }
}
