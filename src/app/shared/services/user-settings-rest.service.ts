import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { RestService } from './rest.service';
import { SETTINGS, Settings } from '../../settings';
import { UserSetting } from '../models/user-setting.model';
import { decode } from '../utils/decode';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsRestService extends RestService<typeof UserSetting> {
  private refetchSubject = new BehaviorSubject(null);

  constructor(http: HttpClient, @Inject(SETTINGS) settings: Settings) {
    super(http, settings, UserSetting, 'UserSettings');
  }

  get refetch(): Observable<any> {
    return this.refetchSubject.asObservable();
  }

  getUserSettingsCst(): Observable<UserSetting> {
    return this.http
      .get<UserSetting>(`${this.baseUrl}/Cst`)
      .pipe(switchMap(decode(this.codec)));
  }

  updateUserSettingsCst(updatedSettings: UserSetting): Observable<any> {
    return this.http
      .patch(`${this.baseUrl}/Cst`, updatedSettings)
      .pipe(tap(() => this.refetchSubject.next(null)));
  }
}
