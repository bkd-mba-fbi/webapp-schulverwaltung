import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SettingsService } from './settings.service';
import { RestService } from './rest.service';
import {
  LessonIncident,
  LessonIncidentProps
} from '../models/lesson-incident.model';

@Injectable({
  providedIn: 'root'
})
export class LessonIncidentsRestService extends RestService<
  LessonIncidentProps
> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, LessonIncident, 'LessonIncidents');
  }
}
