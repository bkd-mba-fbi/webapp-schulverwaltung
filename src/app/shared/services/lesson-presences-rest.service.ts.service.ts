import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import { LessonPresence } from '../models/lesson-presence.model';

@Injectable({
  providedIn: 'root'
})
export class LessonPresencesRestService extends RestService<LessonPresence> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, 'LessonPresences');
  }
}
