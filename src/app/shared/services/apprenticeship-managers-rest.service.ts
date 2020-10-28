import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SETTINGS, Settings } from '../../settings';
import { ApprenticeshipManager } from '../models/apprenticeship-manager.model';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class ApprenticeshipManagersRestService extends RestService<
  typeof ApprenticeshipManager
> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, ApprenticeshipManager, 'ApprenticeshipManagers');
  }
}
