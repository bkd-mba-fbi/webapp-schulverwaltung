import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { MyProfileEntryComponent } from "./my-profile-entry.component";

describe("MyProfileEntryComponent", () => {
  let component: MyProfileEntryComponent;
  let fixture: ComponentFixture<MyProfileEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyProfileEntryComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
