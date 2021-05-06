import { TestBed } from '@angular/core/testing';

import { MySettingsService } from './my-settings.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import { buildUserSettingWithNotificationSetting } from 'src/spec-builders';
import { of } from 'rxjs';
import { NotificationSettingPropertyValueType } from 'src/app/shared/models/user-setting.model';

describe('MySettingsService', () => {
  let settingsService: jasmine.SpyObj<UserSettingsRestService>;
  let service: MySettingsService;

  const userSetting = buildUserSettingWithNotificationSetting(
    false,
    false,
    true
  );

  settingsService = jasmine.createSpyObj('UserSettingsRestService', [
    'getUserSettingsCst',
    'updateUserSettingsCst',
  ]);
  settingsService.getUserSettingsCst.and.returnValue(of(userSetting));
  settingsService.updateUserSettingsCst.and.returnValue(of({}));

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = new MySettingsService(settingsService);
  });

  it('get notification settings', (done) => {
    const result: NotificationSettingPropertyValueType[] = [];
    service.getCurrentNotificationSettingsPropertyValue().subscribe({
      next: (value) => result.push(value),
      complete: () => {
        expect(result.length).toBe(1);
        expect(result[0].gui).toBe(false);
        expect(result[0].mail).toBe(false);
        expect(result[0].phoneMobile).toBe(true);
        done();
      },
    });
    expect(settingsService.getUserSettingsCst).toHaveBeenCalled();
  });

  it('update notification settings', () => {
    service
      .updateCurrentNotificationSettingsPropertyValue(true, false, false)
      .subscribe();
    expect(settingsService.updateUserSettingsCst).toHaveBeenCalledTimes(1);
  });
});
