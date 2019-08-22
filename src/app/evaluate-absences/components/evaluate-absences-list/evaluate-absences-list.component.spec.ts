import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateAbsencesListComponent } from './evaluate-absences-list.component';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { EvaluateAbsencesStateService } from '../../services/evaluate-absences-state.service';
import { of } from 'rxjs';
import { LessonPresenceStatistic } from 'src/app/shared/models/lesson-presence-statistic';
import { buildLessonPresenceStatistic } from 'src/spec-builders';

describe('EvaluateAbsencesListComponent', () => {
  let fixture: ComponentFixture<EvaluateAbsencesListComponent>;
  let element: HTMLElement;
  let stateServiceMock: EvaluateAbsencesStateService;
  let statistic: LessonPresenceStatistic;

  beforeEach(async(() => {
    statistic = buildLessonPresenceStatistic(333);

    stateServiceMock = ({
      entries$: of([statistic])
    } as unknown) as EvaluateAbsencesStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [EvaluateAbsencesListComponent],
        providers: [
          { provide: EvaluateAbsencesStateService, useValue: stateServiceMock }
        ]
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateAbsencesListComponent);
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should show the results table', () => {
    expect(element.querySelectorAll('table').length).toBe(1);
  });
});
