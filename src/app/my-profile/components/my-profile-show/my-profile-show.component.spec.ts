import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { Person } from "src/app/shared/models/person.model";
import { Apprenticeship } from "src/app/shared/services/student-profile.service";
import { buildPerson } from "../../../../spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import {
  expectElementPresent,
  expectNotInTheDocument,
  expectText,
} from "../../../../specs/expectations";
import { MyProfileService } from "../../services/my-profile.service";
import { MyProfileShowComponent } from "./my-profile-show.component";

describe("MyProfileShowComponent", () => {
  let fixture: ComponentFixture<MyProfileShowComponent>;
  let profileServiceMock: jasmine.SpyObj<MyProfileService>;
  let person$: BehaviorSubject<Option<Person>>;
  let legalRepresentatives$: BehaviorSubject<Option<ReadonlyArray<Person>>>;
  let apprenticeships$: BehaviorSubject<Option<ReadonlyArray<Apprenticeship>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [MyProfileShowComponent],
        providers: [
          {
            provide: MyProfileService,
            useFactory() {
              profileServiceMock = jasmine.createSpyObj("MyProfileService", [
                "reloadStudent",
              ]);

              person$ = new BehaviorSubject<Option<Person>>(null);
              profileServiceMock.person$ = person$.asObservable();
              profileServiceMock.loadingPerson$ = of(false);

              legalRepresentatives$ = new BehaviorSubject<
                Option<ReadonlyArray<Person>>
              >(null);
              profileServiceMock.legalRepresentatives$ =
                legalRepresentatives$.asObservable();
              profileServiceMock.loadingLegalRepresentatives$ = of(false);

              apprenticeships$ = new BehaviorSubject<
                Option<ReadonlyArray<Apprenticeship>>
              >(null);
              profileServiceMock.apprenticeships$ =
                apprenticeships$.asObservable();
              profileServiceMock.loadingApprenticeships$ = of(false);

              profileServiceMock.stayPermit$ = of(null);
              profileServiceMock.loadingStayPermit$ = of(false);

              return profileServiceMock;
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileShowComponent);
  });

  it("renders profile information", () => {
    person$.next(buildPerson(1));
    legalRepresentatives$.next([]);
    apprenticeships$.next([]);
    fixture.detectChanges();
    expectElementPresent(fixture.debugElement, "profile-title");
    expectElementPresent(fixture.debugElement, "profile-content");

    expectNotInTheDocument(fixture.debugElement, "profile-substitution");
    expectNotInTheDocument(fixture.debugElement, "profile-none");
  });

  it("renders substitution active text if no substitution is active and no user is present", () => {
    person$.next(null);
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
