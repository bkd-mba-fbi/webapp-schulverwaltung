<<<<<<< HEAD
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
=======
import { Injectable, Inject, Type } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
>>>>>>> fc291c0... initial version of notifications element/module

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

<<<<<<< HEAD
  getUserSettingsCst(): Observable<UserSetting> {
=======
  get refetch(): Observable<any> {
    return this.refetchSubject.asObservable();
  }

  getUserSettingsCst(
    params?: HttpParams | Dict<string>
  ): Observable<UserSetting> {
>>>>>>> fc291c0... initial version of notifications element/module
    return this.http
      .get<UserSetting>(`${this.baseUrl}/Cst`, { params })
      .pipe(switchMap(decode(this.codec)));
  }

  updateUserSettingsCst(updatedSettings: UserSetting): Observable<any> {
    return this.http.patch(`${this.baseUrl}/Cst`, updatedSettings);
  }
}
