import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import {
  LessonAbsence,
  LessonAbsenceProps
} from '../models/lesson-absence.model';

@Injectable({
  providedIn: 'root'
})
export class LessonAbsencesRestService extends RestService<LessonAbsenceProps> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, LessonAbsence, 'LessonAbsences');
  }
}
