import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import {
  LessonDispensation,
  LessonDispensationProps
} from '../models/lesson-dispensation.model';

@Injectable({
  providedIn: 'root'
})
export class LessonDispensationsRestService extends RestService<
  LessonDispensationProps
> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, LessonDispensation, 'LessonDispensations');
  }
}
