import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { PersonProps, Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonsRestService extends RestService<PersonProps> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, Person, 'Persons');
  }
}
