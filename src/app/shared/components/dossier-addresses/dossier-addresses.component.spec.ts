import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { buildStudent } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierStateService } from '../../services/dossier-state.service';
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
        declarations: [DossierAddressesComponent],
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
