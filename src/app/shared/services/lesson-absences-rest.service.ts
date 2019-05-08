import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import { LessonAbsence } from '../models/lesson-absence.model';

@Injectable({
  providedIn: 'root'
})
export class LessonAbsencesRestService extends RestService<LessonAbsence> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'LessonAbsences');
  }

  protected buildEntry(json: any): LessonAbsence {
    return LessonAbsence.from(json);
  }
}
