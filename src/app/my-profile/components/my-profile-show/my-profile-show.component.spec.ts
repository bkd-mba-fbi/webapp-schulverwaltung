import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { MyProfileService } from "../../services/my-profile.service";
import { MyProfileShowComponent } from "./my-profile-show.component";

describe("MyProfileShowComponent", () => {
  let component: MyProfileShowComponent;
  let fixture: ComponentFixture<MyProfileShowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyProfileShowComponent],
        providers: [MyProfileService],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
