import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeAll, switchMap, filter } from 'rxjs/operators';
import { withConfig } from 'src/app/rest-error-interceptor';
import {
  BaseProperty,
  NotificationDataPropertyValueType,
  UserSetting,
} from 'src/app/shared/models/user-setting.model';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import { decodeArray } from 'src/app/shared/utils/decode';
import { buildUserSetting } from 'src/spec-builders';

@Injectable({
  providedIn: 'root',
})
export class MyNotificationsService {
  notifications$: Observable<NotificationDataPropertyValueType[]> = of();

  constructor(private settingsService: UserSettingsRestService) {}

  getCurrentUserSettingsCst(
    params?: HttpParams | Dict<string>
  ): Observable<UserSetting> {
    return this.settingsService.getUserSettingsCst(params);
  }

  updateCurrentUserSettingsCst(updatedSettings: UserSetting): Observable<any> {
    return this.settingsService.updateUserSettingsCst(updatedSettings);
  }

  getCurrentNotificationDataPropertyValue(): Observable<
    ReadonlyArray<NotificationDataPropertyValueType>
  > {
    return this.getCurrentUserSettingsCst(
      withConfig({ disableErrorHandling: true })
    ).pipe(
      map<UserSetting, BaseProperty[]>((i) => i.Settings),
      mergeAll(),
      filter((i) => i.Key === 'notificationData'),
      map((v) => JSON.parse(v.Value)),
      switchMap(decodeArray(NotificationDataPropertyValueType))
    );
  }

  updateCurrentNotificationDataPropertyValue(
    data: ReadonlyArray<NotificationDataPropertyValueType>
  ): Observable<any> {
    const body: BaseProperty = {
      Key: 'notificationData',
      Value: JSON.stringify(data),
    };
    const cst = Object.assign({}, buildUserSetting());
    cst.Settings.push(body);
    return this.updateCurrentUserSettingsCst(cst);
  }
}
