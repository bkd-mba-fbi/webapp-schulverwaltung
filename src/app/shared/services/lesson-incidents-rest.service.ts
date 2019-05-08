import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SettingsService } from './settings.service';
import { RestService } from './rest.service';
import { LessonIncident } from '../models/lesson-incident.model';

@Injectable({
  providedIn: 'root'
})
export class LessonIncidentsRestService extends RestService<LessonIncident> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'LessonIncidents');
  }

  protected buildEntry(json: any): LessonIncident {
    return LessonIncident.from(json);
  }
}
