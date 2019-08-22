import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsRestService extends RestService<typeof Person> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Person, 'Persons');
  }

  getListForIds(
    personIds: ReadonlyArray<number>
  ): Observable<ReadonlyArray<Person>> {
    return this.getList({ 'filter.Id': `;${personIds.join(';')}` });
  }
}
