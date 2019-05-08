import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SettingsService } from './settings.service';
import { PresenceType, PresenceTypeProps } from '../models/presence-type.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceTypesService extends RestService<PresenceTypeProps> {
  constructor(http: HttpClient, settings: SettingsService) {
    super(http, settings, PresenceType, 'PresenceTypes');
  }
}
