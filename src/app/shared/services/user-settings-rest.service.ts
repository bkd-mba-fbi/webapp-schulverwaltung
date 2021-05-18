import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { UserSetting } from '../models/user-setting.model';
import { decode } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsRestService extends RestService<typeof UserSetting> {
  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, UserSetting, 'UserSettings');
  }

  getUserSettingsCst(
    params?: HttpParams | Dict<string>
  ): Observable<UserSetting> {
    return this.http
      .get<UserSetting>(`${this.baseUrl}/Cst`, { params })
      .pipe(switchMap(decode(this.codec)));
  }

  updateUserSettingsCst(updatedSettings: UserSetting): Observable<any> {
    return this.http.patch(`${this.baseUrl}/Cst`, updatedSettings);
  }
}
