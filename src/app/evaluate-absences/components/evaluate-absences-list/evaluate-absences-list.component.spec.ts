import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluateAbsencesListComponent } from './evaluate-absences-list.component';
import { EvaluateAbsencesHeaderComponent } from '../evaluate-absences-header/evaluate-absences-header.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';
import { of } from 'rxjs';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';
import { buildLessonPresenceStatistic } from 'src/spec-builders';
import { StorageService } from '../../../shared/services/storage.service';

describe('EvaluateAbsencesListComponent', () => {
  let fixture: ComponentFixture<EvaluateAbsencesListComponent>;
  let element: HTMLElement;
  let stateServiceMock: EvaluateAbsencesStateService;
  let statistic: LessonPresenceStatistic;

  beforeEach(
    waitForAsync(() => {
      statistic = buildLessonPresenceStatistic(333);

      stateServiceMock = ({
        setFilter: jasmine.createSpy('setFilter'),
        isFilterValid$: of(true),
        validFilter$: of({
          student: null,
          educationalEvent: null,
          studyClass: 5976,
        }),
        entries$: of([statistic]),
        sorting$: of({ key: 'StudentFullName', ascending: true }),
        loading$: of(false),
        sortService: {
          getSortingChar$: () => of('↑'),
        },
      } as unknown) as EvaluateAbsencesStateService;

      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [
            EvaluateAbsencesHeaderComponent,
            EvaluateAbsencesListComponent,
          ],
          providers: [
            {
              provide: EvaluateAbsencesStateService,
              useValue: stateServiceMock,
            },
            {
              provide: StorageService,
              useValue: {
                getPayload(): Option<object> {
                  return { id_person: 42 };
                },
              },
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesListComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should show the results table', () => {
    expect(element.querySelectorAll('table').length).toBe(1);
  });
});
