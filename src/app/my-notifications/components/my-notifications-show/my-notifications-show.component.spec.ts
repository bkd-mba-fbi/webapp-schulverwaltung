import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { of } from "rxjs";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyNotificationsShowComponent } from "./my-notifications-show.component";

describe("MyNotificationsShowComponent-WithData", () => {
  let fixture: ComponentFixture<MyNotificationsShowComponent>;
  let shadowRoot: DocumentFragment;
  let userSettings: jasmine.SpyObj<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    userSettings = jasmine.createSpyObj("UserSettingsService", [
      "refetch",
      "getNotificationData",
      "saveNotificationData",
    ]);
    userSettings.getNotificationData.and.returnValue(
      of([{ id: 1, subject: "subject", body: "body" }]),
    );
    userSettings.saveNotificationData.and.returnValue(of({}));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyNotificationsShowComponent],
        providers: [
          {
            provide: UserSettingsService,
            useValue: userSettings,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationsShowComponent);
    shadowRoot = fixture.debugElement.nativeElement.shadowRoot;
    fixture.detectChanges();
  });

  it("expect delete all to be enabled", () => {
    const field = shadowRoot.querySelector(
      `button[id="notifications-delete-all"]`,
    ) as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.disabled).toBeFalsy();
  });

  it('expect bell not to be "hidden"', () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-bell-hidden",
    )[0] as HTMLInputElement;
    expect(field).toBeUndefined();
  });

  it('expect counter to be "1"', () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-bell-counter-visible",
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.innerHTML).toBe("1");
  });

  it("expect one notifications to be listed", () => {
    const fields = shadowRoot.querySelectorAll(
      ".notifications-delete-notification",
    );
    expect(fields.length).toBe(1);
  });

  it("expect user settings call when deleteAll clicked", () => {
    const field = shadowRoot.querySelector(
      `button[id="notifications-delete-all"]`,
    ) as HTMLInputElement;
    field.click();
    expect(userSettings.saveNotificationData).toHaveBeenCalled();
    expect(userSettings.refetch).toHaveBeenCalled();
  });

  it("expect user settings call when delete clicked", () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-delete-notification",
    )[0] as HTMLInputElement;
    field.click();
    expect(userSettings.saveNotificationData).toHaveBeenCalled();
    expect(userSettings.refetch).toHaveBeenCalled();
  });
});

describe("MyNotificationsShowComponent-WithoutData", () => {
  let fixture: ComponentFixture<MyNotificationsShowComponent>;
  let shadowRoot: DocumentFragment;
  let userSettings: jasmine.SpyObj<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    userSettings = jasmine.createSpyObj("MyNotificationsService", [
      "refetch",
      "getNotificationData",
      "saveNotificationData",
    ]);
    userSettings.getNotificationData.and.returnValue(of([]));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyNotificationsShowComponent],
        providers: [
          {
            provide: UserSettingsService,
            useValue: userSettings,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationsShowComponent);
    shadowRoot = fixture.debugElement.nativeElement.shadowRoot;
    fixture.detectChanges();
  });

  it("expect delete all to be disabled", () => {
    const field = shadowRoot.querySelector(
      `button[id="notifications-delete-all"]`,
    ) as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.disabled).toBeTruthy();
  });

  it("expect bell to be shown", () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-bell-hidden",
    )[0] as HTMLInputElement;
    expect(field).toBeUndefined();
  });

  it("expect counter to be zero", () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-bell-counter-visible",
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
    expect(field.innerHTML).toBe("0");
  });

  it("expect no notifications to be listed", () => {
    const fields = shadowRoot.querySelectorAll(
      ".notifications-delete-notification",
    );
    expect(fields.length).toBe(0);
  });
});

describe("MyNotificationsShowComponent-WithoutAuthorization", () => {
  let fixture: ComponentFixture<MyNotificationsShowComponent>;
  let shadowRoot: DocumentFragment;
  let userSettings: jasmine.SpyObj<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    userSettings = jasmine.createSpyObj("MyNotificationsService", [
      "refetch",
      "getNotificationData",
      "saveNotificationData",
    ]);
    userSettings.getNotificationData.and.returnValue(of([]));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyNotificationsShowComponent],
        providers: [
          {
            provide: UserSettingsService,
            useValue: userSettings,
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNotificationsShowComponent);
    shadowRoot = fixture.debugElement.nativeElement.shadowRoot;
    fixture.detectChanges();
  });

  it('expect bell to be "hidden"', () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-bell-hidden",
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
  });

  it("expect counter not to be shown", () => {
    const field = shadowRoot.querySelectorAll(
      ".notifications-bell-counter-hidden",
    )[0] as HTMLInputElement;
    expect(field).not.toBeNull();
  });
});
