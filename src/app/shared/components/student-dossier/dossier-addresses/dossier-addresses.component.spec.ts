import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { DossierStateService } from 'src/app/shared/services/dossier-state.service';
import { buildStudent } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentDossierAddressComponent } from '../student-dossier-address/student-dossier-address.component';
import { StudentDossierEntryHeaderComponent } from '../student-dossier-entry-header/student-dossier-entry-header.component';
import { StudentDossierApprenticeshipCompanyComponent } from '../student-dossier-apprenticeship-company/student-dossier-apprenticeship-company.component';
import { StudentDossierLegalRepresentativeComponent } from '../student-dossier-legal-representative/student-dossier-legal-representative.component';
import { DossierAddressesComponent } from './dossier-addresses.component';

describe('DossierAddressesComponent', () => {
  let component: DossierAddressesComponent;
  let fixture: ComponentFixture<DossierAddressesComponent>;
  let stateServiceMock: DossierStateService;
  let isOverview$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isOverview$ = new BehaviorSubject<boolean>(false);

    stateServiceMock = ({
      profile$: of({
        student: buildStudent(123),
        legalRepresentativePersons: [],
        apprenticeshipCompanies: [],
      }),
      isOverview$,
    } as unknown) as DossierStateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [
          DossierAddressesComponent,
          StudentDossierEntryHeaderComponent,
          StudentDossierAddressComponent,
          StudentDossierLegalRepresentativeComponent,
          StudentDossierApprenticeshipCompanyComponent,
        ],
        providers: [
          { provide: DossierStateService, useValue: stateServiceMock },
        ],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});