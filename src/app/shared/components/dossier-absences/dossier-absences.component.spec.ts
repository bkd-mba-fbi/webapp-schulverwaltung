import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DossierStateService } from '../../services/dossier-state.service';
import { StudentProfileAbsencesService } from '../../services/student-profile-absences.service';
import { DossierAbsencesComponent } from './dossier-absences.component';

describe('DossierAbsencesComponent', () => {
  let component: DossierAbsencesComponent;
  let fixture: ComponentFixture<DossierAbsencesComponent>;
  let isOverview$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isOverview$ = new BehaviorSubject<boolean>(false);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierAbsencesComponent],
        providers: [DossierStateService],
      })
    )
      .overrideComponent(DossierAbsencesComponent, {
        set: {
          providers: [
            {
              provide: StudentProfileAbsencesService,
              useValue: {
                counts$: of({ checkableAbsences: null }),
                openAbsences$: of([]),
                openAbsencesCount$: of(null),
                setStudentId: jasmine.createSpy('setStudentId'),
              },
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
