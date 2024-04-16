import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Observable, of } from "rxjs";
import { buildPerson } from "../../../../spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import {
  expectElementPresent,
  expectNotInTheDocument,
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
    profile$: Observable<Option<Profile<Person>>>;
    noAccess$: Observable<boolean>;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyProfileShowComponent],
        providers: [
          {
            provide: MyProfileService,
            useFactory() {
              profileServiceMock = {
                loading$: of(false),
                noAccess$: of(false),
                profile$: of(null),
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
    it("should show profile", () => {
      profileServiceMock.profile$ = of({
        student: buildPerson(1),
        legalRepresentativePersons: [],
        apprenticeshipCompanies: [],
      });
      fixture.detectChanges();
      expectElementPresent(fixture.debugElement, "profile-title");
      expectElementPresent(fixture.debugElement, "profile-content");

      expectNotInTheDocument(fixture.debugElement, "profile-substitution");
      expectNotInTheDocument(fixture.debugElement, "profile-none");
    });

    it("should show no profile text", () => {
      profileServiceMock.profile$ = of(null);
      fixture.detectChanges();
      expectElementPresent(fixture.debugElement, "profile-title");
      expectText(
        fixture.debugElement,
        "profile-none",
        "shared.profile.no-profile",
      );

      expectNotInTheDocument(fixture.debugElement, "profile-content");
      expectNotInTheDocument(fixture.debugElement, "profile-substitution");
    });
  });

  describe("substitution active", () => {
    it("should show substitution active text", () => {
      profileServiceMock.noAccess$ = of(true);
      fixture.detectChanges();
      expectElementPresent(fixture.debugElement, "profile-title");
      expectText(
        fixture.debugElement,
        "profile-substitution",
        "shared.profile.substitution-profile",
      );

      expectNotInTheDocument(fixture.debugElement, "profile-content");
      expectNotInTheDocument(fixture.debugElement, "profile-none");
    });
  });
});
