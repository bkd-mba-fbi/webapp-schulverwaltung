import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { MySettingsComponent } from "./my-settings.component";

describe("MySettingsComponent", () => {
  let component: MySettingsComponent;
  let fixture: ComponentFixture<MySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MySettingsComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
