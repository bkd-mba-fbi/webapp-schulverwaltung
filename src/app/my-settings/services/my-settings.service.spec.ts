import { TestBed } from '@angular/core/testing';

import { MySettingsService } from './my-settings.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import { buildUserSettingWithNotification } from 'src/spec-builders';
import { Observable, of } from 'rxjs';
import {
  map,
  mergeAll,
  filter,
  defaultIfEmpty,
  first,
  tap,
  take,
} from 'rxjs/operators';
import {
  BaseProperty,
  NotificationProperty,
  NotificationPropertyValueType,
  UserSetting,
} from 'src/app/shared/models/user-setting.model';
import { decode } from 'src/app/shared/utils/decode';
import { switchMap } from 'rxjs/operators';

describe('MySettingsService', () => {
  let settingsService: jasmine.SpyObj<UserSettingsRestService>;
  let service: MySettingsService;

  const userSetting = buildUserSettingWithNotification(false, false, true);

  settingsService = jasmine.createSpyObj('UserSettingsRestService', [
    'getUserSettingsCst',
    'updateUserSettingsCst',
  ]);
  settingsService.getUserSettingsCst.and.returnValue(of(userSetting));
  settingsService.updateUserSettingsCst.and.returnValue(of({}));
  (settingsService as any).refetch = of({});

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = new MySettingsService(settingsService);
  });

  it('get notification settings', (done) => {
    const source = service.getCurrentNotificationSettingsPropertyValue();
    const result: NotificationPropertyValueType[] = [];
    source.subscribe({
      next: (value) => result.push(value),
      complete: () => {
        expect(result.length).toBe(1);
        expect(result[0].gui).toBe(false);
        expect(result[0].mail).toBe(false);
        expect(result[0].phoneMobile).toBe(true);
        done();
      },
    });
  });

  it('update notification settings', () => {
    service
      .updateCurrentNotificationSettingsPropertyValue(true, false, false)
      .subscribe();
    expect(settingsService.updateUserSettingsCst).toHaveBeenCalled();
  });
});
