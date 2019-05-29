import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as t from 'io-ts/lib/index';

import { Settings } from '../../settings';
import { decode, decodeArray } from '../utils/decode';

export abstract class RestService<P extends t.AnyProps> {
  constructor(
    protected http: HttpClient,
    protected settings: Settings,
    protected decoder: t.TypeC<P>,
    protected resourcePath: string
  ) {}

  get(id: number): Observable<t.TypeOfProps<P>> {
    return this.http
      .get<any>(`${this.baseUrl}/${id}`)
      .pipe(switchMap(decode(this.decoder)));
  }

  getList(params?: Dict<string>): Observable<ReadonlyArray<t.TypeOfProps<P>>> {
    return this.http
      .get<any[]>(this.baseUrl, { params })
      .pipe(switchMap(decodeArray(this.decoder)));
  }

  protected get baseUrl(): string {
    return [this.settings.apiUrl, this.resourcePath].join('/');
  }
}
