import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { MyNotificationsService } from '../../services/my-notifications.service';

import { MyNotificationsShowComponent } from './my-notifications-show.component';

describe('MyNotificationsShowComponent-WithData', () => {
  let fixture: ComponentFixture<MyNotificationsShowComponent>;
  let element: HTMLElement;
  let service: jasmine.SpyObj<MyNotificationsService>;

  service = jasmine.createSpyObj('MyNotificationsService', [
    'getCurrentNotificationDataPropertyValue',
    'updateCurrentNotificationDataPropertyValue',
  ]);
  service.getCurrentNotificationDataPropertyValue.and.returnValue(
    of([{ id: 1, subject: 'subject', body: 'body' }])
  );
  service.updateCurrentNotificationDataPropertyValue.and.returnValue(of({}));

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [MyNotificationsShowComponent],
          providers: [
            {
              provide: MyNotificationsService,
              useValue: service,
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationsShowComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('expect delete all to be enabled', () => {
    const field = element.querySelector(
      `button[id="notifications-delete-all"]`
    ) as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.disabled).toBeFalsy();
  });

  it('expect bell no to be "hidden"', () => {
    const field = element.getElementsByClassName(
      'notifications-bell-hidden'
    )[0] as HTMLInputElement;
    expect(field).toBeUndefined();
  });

  it('expect counter to be "1"', () => {
    const field = element.getElementsByClassName(
      'notifications-bell-counter-visible'
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.innerHTML).toBe('1');
  });

  it('expect one notifications to be listed', () => {
    const fields = element.getElementsByClassName(
      'notifications-delete-notification'
    );
    expect(fields.length).toBe(1);
  });

  it('expect service call when deleteAll clicked', () => {
    const field = element.querySelector(
      `button[id="notifications-delete-all"]`
    ) as HTMLInputElement;
    field.click();
    expect(
      service.updateCurrentNotificationDataPropertyValue
    ).toHaveBeenCalled();
  });

  it('expect service call when delete clicked', () => {
    const field = element.getElementsByClassName(
      'notifications-delete-notification'
    )[0] as HTMLInputElement;
    field.click();
    expect(
      service.updateCurrentNotificationDataPropertyValue
    ).toHaveBeenCalled();
  });
});

describe('MyNotificationsShowComponent-WithoutData', () => {
  let fixture: ComponentFixture<MyNotificationsShowComponent>;
  let element: HTMLElement;
  let service: jasmine.SpyObj<MyNotificationsService>;

  service = jasmine.createSpyObj('MyNotificationsService', [
    'getCurrentNotificationDataPropertyValue',
    'updateCurrentNotificationDataPropertyValue',
  ]);
  service.getCurrentNotificationDataPropertyValue.and.returnValue(of([]));

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [MyNotificationsShowComponent],
          providers: [
            {
              provide: MyNotificationsService,
              useValue: service,
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationsShowComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('expect delete all to be disabled', () => {
    const field = element.querySelector(
      `button[id="notifications-delete-all"]`
    ) as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.disabled).toBeTruthy();
  });

  it('expect bell to be shown', () => {
    const field = element.getElementsByClassName(
      'notifications-bell-hidden'
    )[0] as HTMLInputElement;
    expect(field).toBeUndefined();
  });

  it('expect counter to be zero', () => {
    const field = element.getElementsByClassName(
      'notifications-bell-counter-visible'
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.innerHTML).toBe('0');
  });

  it('expect no notifications to be listed', () => {
    const fields = element.getElementsByClassName(
      'notifications-delete-notification'
    );
    expect(fields.length).toBe(0);
  });
});

describe('MyNotificationsShowComponent-WithoutAuthorization', () => {
  let fixture: ComponentFixture<MyNotificationsShowComponent>;
  let element: HTMLElement;
  let service: jasmine.SpyObj<MyNotificationsService>;

  service = jasmine.createSpyObj('MyNotificationsService', [
    'getCurrentNotificationDataPropertyValue',
    'updateCurrentNotificationDataPropertyValue',
  ]);
  service.getCurrentNotificationDataPropertyValue.and.returnValue(of([]));

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [MyNotificationsShowComponent],
          providers: [
            {
              provide: MyNotificationsService,
              useValue: service,
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationsShowComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('expect bell to be "hidden"', () => {
    const field = element.getElementsByClassName(
      'notifications-bell-hidden'
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
  });

  it('expect counter not to be shown', () => {
    const field = element.getElementsByClassName(
      'notifications-bell-counter-hidden'
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
  });
});
