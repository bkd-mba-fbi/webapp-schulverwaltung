import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { LessonAbsence } from '../models/lesson-absence.model';

@Injectable({
  providedIn: 'root',
})
export class LessonAbsencesRestService extends RestService<
  typeof LessonAbsence
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonAbsence, 'LessonAbsences');
  }
}
