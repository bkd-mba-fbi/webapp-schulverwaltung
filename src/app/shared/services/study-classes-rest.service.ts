import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SETTINGS, Settings } from '../../settings';
import { TypeaheadRestService } from './typeahead-rest.service';
import { StudyClass } from '../models/study-class.model';

@Injectable({
  providedIn: 'root'
})
export class StudyClassesRestService extends TypeaheadRestService<
  typeof StudyClass
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, StudyClass, 'StudyClasses', 'Number');
  }
}
