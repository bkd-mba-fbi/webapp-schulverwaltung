import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MySettingsNotificationsComponent } from "../my-settings-notifications/my-settings-notifications.component";
import { MySettingsShowComponent } from "./my-settings-show.component";

describe("MySettingsShowComponent", () => {
  let component: MySettingsShowComponent;
  let fixture: ComponentFixture<MySettingsShowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          MySettingsShowComponent,
          MySettingsNotificationsComponent,
        ],
        providers: [
          {
            provide: StorageService,
            useValue: {
              getPayload(): Dict<unknown> {
                return { id_person: "123" };
              },
            },
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
