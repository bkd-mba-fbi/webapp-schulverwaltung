import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { Person } from '../models/person.model';
import { decode } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class PersonsRestService extends RestService<typeof Person> {
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
}
