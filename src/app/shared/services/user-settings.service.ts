import { Injectable } from '@angular/core';
import {
  debounceTime,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  UserSetting,
  NotificationChannels,
  NotificationTypesInactive,
  UserSettings,
  NotificationData,
  PresenceControlViewMode,
  PresenceControlViewModeObject,
  PresenceControlGroupView,
} from '../models/user-settings.model';
import { decode } from '../utils/decode';
import { defaultValue } from '../utils/observable';
import { UserSettingsRestService } from './user-settings-rest.service';

type SettingKey = UserSetting['Key'];
type SettingValue = UserSetting['Value'];

export const REFETCH_DEBOUNCE_TIME = 100;

const PRESENCE_CONTROL_VIEW_MODE_KEY = 'presenceControlViewMode';
const PRESENCE_CONTROL_GROUP_VIEW_KEY = 'presenceControlGroupView';
const NOTIFICATION_CHANNELS_KEY = 'notification';
const NOTIFICATION_TYPES_INACTIVE_KEY = 'notificationTypesInactive';
const NOTIFICATION_DATA_KEY = 'notificationData';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  private refetch$ = new Subject<void>();

  private settings$ = this.refetch$.pipe(
    startWith(null), // Trigger the initial request
    debounceTime(REFETCH_DEBOUNCE_TIME), // Avoid making two requests initially, when the component is triggering a refetch in `ngOnInit`
    switchMap(() => this.settingsRestService.getUserSettingsCst()),
    map((userSettings) => userSettings.Settings),
    shareReplay(1),
  );

  private accessInfo$ = this.settingsRestService
    .getAccessInfo()
    .pipe(shareReplay(1));

  constructor(private settingsRestService: UserSettingsRestService) {}

  refetch(): void {
    this.refetch$.next();
  }

  /**
   * Generic method for getting the value of a setting (will be `null`
   * if the setting does not exist).
   *
   * The `Observable`s of the get* methods do not complete, use a
   * `.pipe(take(1))` if you only want one value.
   */
  getSetting(key: SettingKey): Observable<Option<SettingValue>> {
    return this.settings$.pipe(
      map((settings) => settings.find((p) => p.Key === key)?.Value ?? null),
    );
  }

  /**
   * Generic method for saving a setting value.
   *
   * The `Observable`s of the save* methods complete after one value.
   */
  saveSetting(key: SettingKey, value: SettingValue): Observable<unknown> {
    return this.settingsRestService
      .updateUserSettingsCst(this.buildSettings(key, value))
      .pipe(tap(() => this.refetch$.next()));
  }

  //
  // Methods for getting/saving specific settings:
  //

  getPresenceControlViewMode(): Observable<PresenceControlViewMode> {
    return this.getSetting(PRESENCE_CONTROL_VIEW_MODE_KEY).pipe(
      defaultValue('{"presenceControl":"grid"}'), // Default view mode is grid if setting is not available
      switchMap(decode(PresenceControlViewModeObject)),
      map(({ presenceControl }) => presenceControl as PresenceControlViewMode),
    );
  }

  savePresenceControlViewMode(
    value: PresenceControlViewMode,
  ): Observable<unknown> {
    return this.saveSetting(
      PRESENCE_CONTROL_VIEW_MODE_KEY,
      PresenceControlViewModeObject.encode({ presenceControl: value }),
    );
  }

  getPresenceControlGroupView(): Observable<PresenceControlGroupView> {
    return this.getSetting(PRESENCE_CONTROL_GROUP_VIEW_KEY).pipe(
      defaultValue('[]'),
      switchMap(decode(PresenceControlGroupView)),
    );
  }

  savePresenceControlGroupView(
    value: PresenceControlGroupView,
  ): Observable<unknown> {
    return this.saveSetting(
      PRESENCE_CONTROL_GROUP_VIEW_KEY,
      PresenceControlGroupView.encode(value),
    );
  }

  getNotificationChannels(): Observable<NotificationChannels> {
    return this.getSetting(NOTIFICATION_CHANNELS_KEY).pipe(
      defaultValue('{}'), // Use empty object if not available, properties will be set to default value by decoder
      switchMap(decode(NotificationChannels)),
    );
  }

  saveNotificationChannels(value: NotificationChannels): Observable<unknown> {
    return this.saveSetting(
      NOTIFICATION_CHANNELS_KEY,
      NotificationChannels.encode(value),
    );
  }

  getNotificationTypesInactive(): Observable<NotificationTypesInactive> {
    return this.getSetting(NOTIFICATION_TYPES_INACTIVE_KEY).pipe(
      defaultValue(''), // Per default, no notification types are inactive (all are subscribed)
      switchMap(decode(NotificationTypesInactive)),
    );
  }

  saveNotificationTypesInactive(
    value: NotificationTypesInactive,
  ): Observable<unknown> {
    return this.saveSetting(
      NOTIFICATION_TYPES_INACTIVE_KEY,
      NotificationTypesInactive.encode(value),
    );
  }

  getNotificationData(): Observable<NotificationData> {
    return this.getSetting(NOTIFICATION_DATA_KEY).pipe(
      defaultValue('[]'),
      switchMap(decode(NotificationData)),
    );
  }

  saveNotificationData(value: NotificationData): Observable<unknown> {
    return this.saveSetting(
      NOTIFICATION_DATA_KEY,
      NotificationData.encode(value),
    );
  }

  getRolesAndPermissions(): Observable<Option<ReadonlyArray<string>>> {
    return this.accessInfo$.pipe(
      map(({ Roles, Permissions }) => [...Roles, ...Permissions]),
      startWith(null),
    );
  }

  private buildSettings(key: SettingKey, value: SettingValue): UserSettings {
    return {
      Id: 'Cst',
      Settings: [{ Key: key, Value: value }],
    };
  }
}
