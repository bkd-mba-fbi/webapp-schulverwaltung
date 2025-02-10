import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import {
  DossierPage,
  DossierStateService,
} from "src/app/shared/services/dossier-state.service";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierContactComponent } from "./dossier-contact.component";

describe("DossierContactComponent", () => {
  let component: DossierContactComponent;
  let fixture: ComponentFixture<DossierContactComponent>;
  let stateServiceMock: DossierStateService;
  let dossierPage$: BehaviorSubject<DossierPage>;

  beforeEach(async () => {
    dossierPage$ = new BehaviorSubject<DossierPage>("contact");

    stateServiceMock = {
      profile$: of({
        student: buildStudent(123),
        legalRepresentativePersons: [],
        apprenticeshipCompanies: [],
      }),
      dossierPage$,
    } as unknown as DossierStateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DossierContactComponent],
        providers: [
          { provide: DossierStateService, useValue: stateServiceMock },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
