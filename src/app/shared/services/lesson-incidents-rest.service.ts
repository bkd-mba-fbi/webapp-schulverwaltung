import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SETTINGS, Settings } from '../../settings';
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
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, LessonIncident, 'LessonIncidents');
  }
}
