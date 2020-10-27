import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SETTINGS, Settings } from '../../settings';
import { ApprenticeshipManager } from '../models/apprenticeship-manager.model';
import { decode } from '../utils/decode';
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

  getApprenticeshipManager(
    apprenticeshipManagerId: number,
    params?: HttpParams | Dict<string>
  ): Observable<ApprenticeshipManager> {
    return this.http
      .get<unknown[]>(`${this.baseUrl}/${apprenticeshipManagerId}`, {
        params,
      })
      .pipe(switchMap(decode(ApprenticeshipManager)));
  }
}
