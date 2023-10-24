import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { SwitchComponent } from 'src/app/shared/components/switch/switch.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MySettingsNotificationsToggleComponent } from '../my-settings-notifications-toggle/my-settings-notifications-toggle.component';
import { MySettingsNotificationsComponent } from './my-settings-notifications.component';

describe('MySettingsNotificationsComponent', () => {
  let fixture: ComponentFixture<MySettingsNotificationsComponent>;
  let userSettings: jasmine.SpyObj<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    userSettings = jasmine.createSpyObj('UserSettingsService', [
      'getNotificationChannels',
      'saveNotificationChannels',
      'getNotificationTypesInactive',
      'saveNotificationTypesInactive',
      'refetch',
    ]);
    userSettings.getNotificationChannels.and.returnValue(
      of({ mail: true, gui: true, phoneMobile: false }),
    );
    userSettings.saveNotificationChannels.and.returnValue(of({}));
    userSettings.getNotificationTypesInactive.and.returnValue(
      of(['BM2Student']),
    );
    userSettings.saveNotificationTypesInactive.and.returnValue(of({}));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          MySettingsNotificationsComponent,
          MySettingsNotificationsToggleComponent,
          SwitchComponent,
        ],
        providers: [
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: '42', roles: 'StudentRole' };
              },
            },
          },
          {
            provide: UserSettingsService,
            useValue: userSettings,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(MySettingsNotificationsComponent);
    await waitForRender();
  });

  describe('field rendering', () => {
    it('renders gui channel form field with value from settings hash', async () => {
      expect(getInput('notification-channels-gui').checked).toBe(true);
    });

    it('renders mail channel form field with value from settings hash', () => {
      expect(getInput('notification-channels-mail').checked).toBe(true);
    });

    it('renders phoneMobile channel form field with value from settings hash', () => {
      expect(getInput('notification-channels-phoneMobile').checked).toBe(false);
    });

    it('renders BM2Student type form field as inactive since present in settings array', () => {
      expect(getInput('notification-types-BM2Student').checked).toBe(false);
    });

    it('renders gradePublish type form field with current value as active since not present in settings', () => {
      expect(getInput('notification-types-gradePublish').checked).toBe(true);
    });

    it('disables types fields if all channels are inactive', async () => {
      expect(getInput('notification-types-BM2Student').disabled).toBeFalsy();

      // Toggle GUI (mail still active)
      getInput('notification-channels-gui').click();
      await waitForRender();
      expect(getInput('notification-types-BM2Student').disabled).toBeFalsy();

      // Toggle mail (all inactive)
      getInput('notification-channels-mail').click();
      await waitForRender();
      expect(getInput('notification-types-BM2Student').disabled).toBeTruthy();

      // Toggle mail again
      getInput('notification-channels-mail').click();
      await waitForRender();
      expect(getInput('notification-types-BM2Student').disabled).toBeFalsy();
    });
  });

  describe('auto-saving', () => {
    it('updates settings and reloads on gui channel form field change', async () => {
      toggleInput('notification-channels-gui');
      expect(userSettings.saveNotificationChannels).toHaveBeenCalledWith({
        gui: false,
        mail: true,
        phoneMobile: false,
      });
    });

    it('updates settings and reloads on mail channel form field change', async () => {
      toggleInput('notification-channels-mail');
      expect(userSettings.saveNotificationChannels).toHaveBeenCalledWith({
        gui: true,
        mail: false,
        phoneMobile: false,
      });
    });

    it('updates settings and reloads on phoneMobile channel form field change', async () => {
      toggleInput('notification-channels-phoneMobile');
      expect(userSettings.saveNotificationChannels).toHaveBeenCalledWith({
        gui: true,
        mail: true,
        phoneMobile: true,
      });
    });

    it('updates settings and reloads on BM2Student types form field change', async () => {
      toggleInput('notification-types-BM2Student');
      expect(userSettings.saveNotificationTypesInactive).toHaveBeenCalledWith(
        [],
      );
    });

    it('updates settings and reloads on gradePublish types form field change', async () => {
      toggleInput('notification-types-gradePublish');
      expect(userSettings.saveNotificationTypesInactive).toHaveBeenCalledWith([
        'BM2Student',
        'gradePublish',
      ]);
    });
  });

  function getInput(id: string): HTMLInputElement {
    const field = document.getElementById(id);
    expect(field).not.toBeNull();
    return field as HTMLInputElement;
  }

  function toggleInput(id: string): void {
    const input = getInput(id);
    input.click();
    fixture.detectChanges();
  }

  function waitForRender() {
    fixture.detectChanges();
    return fixture.whenStable();
  }
});
