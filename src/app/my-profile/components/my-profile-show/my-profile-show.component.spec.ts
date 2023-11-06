import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { StorageService } from "../../../shared/services/storage.service";
import { MyProfileService } from "../../services/my-profile.service";
import { MyProfileShowComponent } from "./my-profile-show.component";

describe("MyProfileShowComponent", () => {
  let component: MyProfileShowComponent;
  let fixture: ComponentFixture<MyProfileShowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyProfileShowComponent],
        providers: [
          MyProfileService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "123" };
              },
            },
          },
        ],
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
