import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MySettingsComponent } from "./my-settings.component";
import { buildTestModuleMetadata } from "../../../../spec-helpers";

describe("MySettingsComponent", () => {
  let component: MySettingsComponent;
  let fixture: ComponentFixture<MySettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MySettingsComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
