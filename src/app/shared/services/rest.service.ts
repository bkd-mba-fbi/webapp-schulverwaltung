import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as t from 'io-ts/lib/index';

import { Settings } from '../../settings';
import { decode, decodeArray } from '../utils/decode';

export const enum HTTP_STATUS {
  UNKNOWN = 0,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

export abstract class RestService<P extends t.AnyProps> {
  constructor(
    protected http: HttpClient,
    protected settings: Settings,
    protected decoder: t.TypeC<P>,
    protected resourcePath: string
  ) {}

  get(
    id: number,
    params?: HttpParams | Dict<string>
  ): Observable<t.TypeOfProps<P>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`, { params })
      .pipe(switchMap(decode(this.decoder)));
  }

  getList(
    params?: HttpParams | Dict<string>
  ): Observable<ReadonlyArray<t.TypeOfProps<P>>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, { params })
      .pipe(switchMap(decodeArray(this.decoder)));
  }

  protected get baseUrl(): string {
    return `${this.settings.apiUrl}/${this.resourcePath}`;
  }
}
