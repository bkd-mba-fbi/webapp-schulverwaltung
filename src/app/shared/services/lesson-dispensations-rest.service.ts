import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import { LessonDispensation } from '../models/lesson-dispensation.model';

@Injectable({
  providedIn: 'root'
})
export class LessonDispensationsRestService extends RestService<
  LessonDispensation
> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'LessonDispensations');
  }

  protected buildEntry(json: any): LessonDispensation {
    return LessonDispensation.from(json);
  }
}
