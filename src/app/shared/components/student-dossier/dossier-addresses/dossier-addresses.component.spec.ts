import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import {
  DossierPage,
  DossierStateService,
} from "src/app/shared/services/dossier-state.service";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierAddressesComponent } from "./dossier-addresses.component";

describe("DossierAddressesComponent", () => {
  let component: DossierAddressesComponent;
  let fixture: ComponentFixture<DossierAddressesComponent>;
  let stateServiceMock: DossierStateService;
  let currentDossier$: BehaviorSubject<DossierPage>;

  beforeEach(async () => {
    currentDossier$ = new BehaviorSubject<DossierPage>("addresses");

    stateServiceMock = {
      profile$: of({
        student: buildStudent(123),
        legalRepresentativePersons: [],
        apprenticeshipCompanies: [],
      }),
      currentDossier$,
    } as unknown as DossierStateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DossierAddressesComponent],
        providers: [
          { provide: DossierStateService, useValue: stateServiceMock },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
