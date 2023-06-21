import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { UserSettings, AccessInfo } from '../models/user-settings.model';
import { decode } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsRestService extends RestService<typeof UserSettings> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, UserSettings, 'UserSettings');
  }

  getUserSettingsCst(
    params?: HttpParams | Dict<string>
  ): Observable<UserSettings> {
    return this.http
      .get<unknown>(`${this.baseUrl}/Cst`, { params })
      .pipe(switchMap(decode(this.codec)));
  }

  updateUserSettingsCst(updatedSettings: UserSettings): Observable<any> {
    return this.http.patch(`${this.baseUrl}/Cst`, updatedSettings);
  }

  getAccessInfo(): Observable<AccessInfo['AccessInfo']> {
    return this.http.get<unknown>(`${this.baseUrl}/?expand=AccessInfo`).pipe(
      switchMap(decode(AccessInfo)),
      map(({ AccessInfo }) => AccessInfo)
    );
  }
}
