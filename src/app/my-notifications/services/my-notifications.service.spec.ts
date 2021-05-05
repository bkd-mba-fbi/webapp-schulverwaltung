import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationDataPropertyValueType } from 'src/app/shared/models/user-setting.model';
import { UserSettingsRestService } from 'src/app/shared/services/user-settings-rest.service';
import {
  buildCstWithNotificationData,
  buildUserSettingWithNotification,
} from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { MyNotificationsService } from './my-notifications.service';

describe('MyNotificationsService', () => {
  let settingsService: jasmine.SpyObj<UserSettingsRestService>;
  let service: MyNotificationsService;

  const notificationData = buildCstWithNotificationData(1, 'subject', 'body');

  settingsService = jasmine.createSpyObj('UserSettingsRestService', [
    'getUserSettingsCst',
    'updateUserSettingsCst',
  ]);
  settingsService.getUserSettingsCst.and.returnValue(of(notificationData));
  settingsService.updateUserSettingsCst.and.returnValue(of({}));
  (settingsService as any).refetch = of({});

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = new MyNotificationsService(settingsService);
  });

  it('fetch notification data', (done) => {
    const source = service.getCurrentNotificationDataPropertyValue();
    let result: ReadonlyArray<NotificationDataPropertyValueType>;
    source.subscribe({
      next: (value) => (result = value),
      complete: () => {
        expect(result.length).toBe(1);
        expect(result[0].id).toBe(1);
        expect(result[0].subject).toBe('subject');
        expect(result[0].body).toBe('body');
        done();
      },
    });
  });

  it('update notification data', () => {
    service.updateCurrentNotificationDataPropertyValue([]).subscribe();
    expect(settingsService.updateUserSettingsCst).toHaveBeenCalled();
  });
});
