import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import * as t from "io-ts/lib/index";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { Settings } from "../../settings";
import { decode, decodeArray } from "../utils/decode";

export const enum HTTP_STATUS {
  UNKNOWN = 0,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class RestService<T extends t.InterfaceType<any>> {
  constructor(
    protected http: HttpClient,
    protected settings: Settings,
    protected codec: T,
    protected resourcePath: string,
  ) {}

  get(
    id: number,
    options?: {
      headers?: HttpHeaders | Dict<string>;
      context?: HttpContext;
    },
  ): Observable<t.TypeOf<T>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/${id}`, options)
      .pipe(switchMap(decode(this.codec)));
  }

  getList(options?: {
    headers?: HttpHeaders | Dict<string>;
    params?: HttpParams | Dict<string>;
  }): Observable<ReadonlyArray<t.TypeOf<T>>> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, options)
      .pipe(switchMap(decodeArray(this.codec)));
  }

  protected get baseUrl(): string {
    return `${this.settings.apiUrl}/${this.resourcePath}`;
  }
}
