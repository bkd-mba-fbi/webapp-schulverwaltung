import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { PresenceType } from '../models/presence-type.model';

/**
 * Don't use this service to load presence types in
 * components/services, use the `PresenceTypesService` instead, that
 * caches these entries and loads them only once throughout the
 * application.
 */
@Injectable({
  providedIn: 'root',
})
export class PresenceTypesRestService extends RestService<typeof PresenceType> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, PresenceType, 'PresenceTypes');
  }
}
