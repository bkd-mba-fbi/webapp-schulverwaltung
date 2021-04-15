import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  BaseProperty,
  NotificationProperty,
  NotificationPropertyValueType,
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

@Injectable()
export class MySettingsService {
  private refetch$ = new BehaviorSubject(null);

  private cstBody: UserSetting = {
    Id: 'Cst',
    Settings: [],
    HRef: null,
  };

  constructor(private settingsService: UserSettingsRestService) {}

  get refetch(): Observable<any> {
    return this.refetch$.asObservable();
  }

  getCurrentUserSettingsCst(): Observable<UserSetting> {
    const ret = this.settingsService.getUserSettingsCst();
    ret.subscribe((n) =>
      sessionStorage.setItem(
        'userSettings',
        JSON.stringify(UserSetting.encode(n))
      )
    );
    return ret;
  }

  updateCurrentUserSettingsCst(updatedSettings: UserSetting): Observable<any> {
    return this.settingsService.updateUserSettingsCst(updatedSettings);
  }

  getCurrentNotificationSettingsPropertyValue(): Observable<NotificationPropertyValueType> {
    return this.settingsService.refetch.pipe(
      switchMap(() =>
        this.getCurrentUserSettingsCst().pipe(
          map<UserSetting, BaseProperty[]>((i) => i.Settings),
          mergeAll(),
          filter((i) => NotificationProperty.is(i)),
          defaultIfEmpty({ Value: '{}' }), // empty value if stream empty, properties are set to their defaults in respect of model
          first(),
          map((v) => JSON.parse(v.Value)),
          switchMap(decode(NotificationPropertyValueType))
        )
      )
    );
  }

  updateCurrentNotificationSettingsPropertyValue(
    gui: boolean,
    mail: boolean,
    phoneMobile: boolean
  ): Observable<any> {
    const propertyBody: NotificationPropertyValueType = {
      gui,
      mail,
      phoneMobile,
    };
    const body: NotificationProperty = {
      Key: 'notification',
      Value: JSON.stringify(propertyBody),
    };
    const cst = Object.assign({}, this.cstBody);
    cst.Settings.push(body);
    return this.updateCurrentUserSettingsCst(cst).pipe(
      tap(() => this.refetch$.next(null))
    );
  }
}
