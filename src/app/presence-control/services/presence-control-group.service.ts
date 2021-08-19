import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { filter, map, mergeAll, switchMap, take } from 'rxjs/operators';
import {
  GroupViewType,
  UserSetting,
  BaseProperty,
} from '../../shared/models/user-setting.model';
import { UserSettingsRestService } from '../../shared/services/user-settings-rest.service';
import { decode } from '../../shared/utils/decode';

@Injectable({
  providedIn: 'root',
})
export class PresenceControlGroupService {
  private selectGroupView$ = new Subject<GroupViewType>();

  savedGroupView$ = merge(
    this.selectGroupView$,
    this.getSavedGroupView().pipe(take(1))
  );

  constructor(private settingsService: UserSettingsRestService) {}

  selectGroupView(view: GroupViewType): void {
    this.selectGroupView$.next(view);
  }

  private getSavedGroupView(): Observable<GroupViewType> {
    return this.settingsService.getUserSettingsCst().pipe(
      map<UserSetting, BaseProperty[]>((i) => i.Settings),
      mergeAll(),
      filter((i) => i.Key === 'presenceControlGroupView'),
      take(1),
      map((v) => JSON.parse(v.Value)),
      switchMap(decode(GroupViewType))
    );
  }
}
