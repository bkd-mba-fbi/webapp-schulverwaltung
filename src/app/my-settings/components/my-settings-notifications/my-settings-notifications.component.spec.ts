import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MySettingsService } from '../../services/my-settings.service';
import { MySettingsNotificationsComponent } from './my-settings-notifications.component';

describe('MySettingsNotificationsComponent', () => {
  let fixture: ComponentFixture<MySettingsNotificationsComponent>;
  let element: HTMLElement;
  let settingsService: jasmine.SpyObj<MySettingsService>;

  settingsService = jasmine.createSpyObj('MySettingsService', [
    'getCurrentNotificationSettingsPropertyValue',
    'updateCurrentNotificationSettingsPropertyValue',
  ]);
  settingsService.getCurrentNotificationSettingsPropertyValue.and.returnValue(
    of({ mail: true, gui: true, phoneMobile: false })
  );
  settingsService.updateCurrentNotificationSettingsPropertyValue.and.returnValue(
    of({})
  );
  (settingsService as any).refetch = of({});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MySettingsNotificationsComponent],
        providers: [
          {
            provide: MySettingsService,
            useValue: settingsService,
          },
        ],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsNotificationsComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('renders form fields with current values', () => {
    expect(getInput('notificationsGui').checked).toBe(true);
    expect(getInput('notificationsMail').checked).toBe(true);
    expect(getInput('notificationsPhoneMobile').checked).toBe(false);
  });

  it('updates settings on submit and reloads', () => {
    changeValue('notificationsGui', false);
    changeValue('notificationsMail', false);
    changeValue('notificationsPhoneMobile', true);
    clickSubmitButton();

    expect(
      settingsService.updateCurrentNotificationSettingsPropertyValue
    ).toHaveBeenCalled();
    expect(
      settingsService.getCurrentNotificationSettingsPropertyValue
    ).toHaveBeenCalled();
  });

  function getInput(name: string): HTMLInputElement {
    const field = element.querySelector(`input[formControlName="${name}"]`);
    expect(field).not.toBeNull();
    return field as HTMLInputElement;
  }

  function changeValue(name: string, value: any): void {
    const input = getInput(name);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function clickSubmitButton(): void {
    const button = element.querySelector(
      '.btn-primary'
    ) as Option<HTMLButtonElement>;
    if (button) {
      button.click();
      fixture.detectChanges();
    }
  }
});
