import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import { buildPerson } from "../../../../spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import {
  expectElementPresent,
  expectText,
} from "../../../../specs/expectations";
import { Person } from "../../../shared/models/person.model";
import { Profile } from "../../../shared/services/student-profile.service";
import { MyProfileService } from "../../services/my-profile.service";
import { MyProfileShowComponent } from "./my-profile-show.component";

describe("MyProfileShowComponent", () => {
  let fixture: ComponentFixture<MyProfileShowComponent>;
  let profileServiceMock: {
    loading$: Observable<boolean>;
    activeSubstitution$: BehaviorSubject<boolean>;
    profile$: Observable<Profile<Person>>;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [MyProfileShowComponent],
        providers: [
          {
            provide: MyProfileService,
            useFactory() {
              profileServiceMock = {
                activeSubstitution$: new BehaviorSubject(true),
                loading$: of(false),
                profile$: of({
                  student: buildPerson(1),
                  legalRepresentativePersons: [],
                  apprenticeshipCompanies: [],
                } as unknown as Profile<Person>),
              };
              return profileServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileShowComponent);
  });

  describe("substitution not active", () => {
    beforeEach(() => {
      profileServiceMock.activeSubstitution$.next(false);
      fixture.detectChanges();
    });

    it("should show profile", () => {
      expectElementPresent(fixture.debugElement, "profile-title");
      expectElementPresent(fixture.debugElement, "profile-content");
    });
  });

  describe("substitution active", () => {
    beforeEach(() => {
      profileServiceMock.activeSubstitution$.next(true);
      fixture.detectChanges();
    });

    it("should show substitution active text", () => {
      expectElementPresent(fixture.debugElement, "profile-title");
      expectText(
        fixture.debugElement,
        "profile-substitution",
        "shared.profile.substitution-profile",
      );
    });
  });
});
