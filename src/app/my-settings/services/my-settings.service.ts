import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  BaseProperty,
  NotificationSettingPropertyValueType,
  UserSetting,
} from 'src/app/shared/models/user-setting.model';
import {
  switchMap,
  filter,
  map,
  mergeAll,
  first,
  tap,
  defaultIfEmpty,
} from 'rxjs/operators';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import { decode } from '../../shared/utils/decode';
import { buildUserSetting } from 'src/spec-builders';

@Injectable()
export class MySettingsService {
  private refetchSubject = new BehaviorSubject(null);

  constructor(private settingsService: UserSettingsRestService) {
    this.settingsService
      .getUserSettingsCst()
      .subscribe((n) =>
        sessionStorage.setItem(
          'userSettings',
          JSON.stringify(UserSetting.encode(n))
        )
      );
  }

  get refetch(): Observable<any> {
    return this.refetchSubject.asObservable();
  }

  getCurrentNotificationSettingsPropertyValue(): Observable<NotificationSettingPropertyValueType> {
    return this.settingsService.getUserSettingsCst().pipe(
      map<UserSetting, BaseProperty[]>((i) => i.Settings),
      mergeAll(),
      filter((i) => i.Key === 'notification'),
      defaultIfEmpty({ Value: '{}' }), // empty value if stream empty, properties are set to their defaults in respect of model
      first(),
      map((v) => JSON.parse(v.Value)),
      switchMap(decode(NotificationSettingPropertyValueType))
    );
  }

  updateCurrentNotificationSettingsPropertyValue(
    gui: boolean,
    mail: boolean,
    phoneMobile: boolean
  ): Observable<any> {
    const propertyBody: NotificationSettingPropertyValueType = {
      gui,
      mail,
      phoneMobile,
    };
    const body: BaseProperty = {
      Key: 'notification',
      Value: JSON.stringify(propertyBody),
    };
    const cst = Object.assign({}, buildUserSetting());
    cst.Settings.push(body);
    return this.settingsService
      .updateUserSettingsCst(cst)
      .pipe(tap(() => this.refetchSubject.next(null)));
  }
}
