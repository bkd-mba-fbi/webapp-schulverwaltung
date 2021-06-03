import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, mapTo, map } from 'rxjs/operators';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { Person } from '../models/person.model';
import { decode, decodeArray } from '../utils/decode';
import * as t from 'io-ts';
import { pick } from '../utils/types';

@Injectable({
  providedIn: 'root',
})
export class PersonsRestService extends RestService<typeof Person> {
  protected personEmailCodec = t.type(
    pick(this.codec.props, ['Email', 'FormOfAddress'])
  );

  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Person, 'Persons');
  }

  getListForIds(
    personIds: ReadonlyArray<number>
  ): Observable<ReadonlyArray<Person>> {
    return this.getList({ params: { 'filter.Id': `;${personIds.join(';')}` } });
  }

  getMyself(): Observable<Person> {
    return this.http
      .get<unknown>(`${this.baseUrl}/me`)
      .pipe(switchMap(decode(this.codec)));
  }

  getByIdWithEmailInfos(id: number): Observable<Person> {
    return this.http
      .get<unknown>(`${this.baseUrl}/`, {
        params: {
          'filter.Id=': id.toString(),
          fields: ['FormOfAddress', 'Email'].join(','),
        },
      })
      .pipe(
        switchMap(decodeArray(this.personEmailCodec)),
        map((person) => person[0])
      );
  }

  update(
    personId: number,
    phonePrivate: Option<string>,
    phoneMobile: Option<string>,
    email2: Maybe<string>
  ): Observable<void> {
    const body = {
      PhonePrivate: phonePrivate,
      PhoneMobile: phoneMobile,
      Email2: email2,
    };
    return this.http
      .put<void>(`${this.baseUrl}/${personId}`, body)
      .pipe(mapTo(undefined));
  }
}
