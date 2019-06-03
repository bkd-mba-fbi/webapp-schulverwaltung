import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { PresenceType, PresenceTypeProps } from '../models/presence-type.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceTypesRestService extends RestService<PresenceTypeProps> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, PresenceType, 'PresenceTypes');
  }
}
