import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as t from 'io-ts/lib/index';

import { decode, decodeArray } from '../utils/decode';
import { SettingsService } from './settings.service';

export abstract class RestService<P extends t.AnyProps> {
  constructor(
    protected http: HttpClient,
    protected settings: SettingsService,
    protected decoder: t.TypeC<P>,
    protected resourcePath: string
  ) {}

  get(id: number): Observable<t.TypeOfProps<P>> {
    return this.withBaseUrl(url => this.http.get<any>(`${url}/${id}`)).pipe(
      switchMap(decode(this.decoder))
    );
  }

  getList(params?: Dict<string>): Observable<ReadonlyArray<t.TypeOfProps<P>>> {
    return this.withBaseUrl(url =>
      this.http
        .get<any[]>(url, { params })
        .pipe(switchMap(decodeArray(this.decoder)))
    );
  }

  protected withBaseUrl<R>(
    callback: (url: string) => Observable<R>
  ): Observable<R> {
    return this.settings.apiUrl$.pipe(
      switchMap(baseUrl => callback(this.buildBaseUrl(baseUrl)))
    );
  }

  protected buildBaseUrl(baseUrl: string): string {
    return [baseUrl, this.resourcePath].join('/');
  }
}
