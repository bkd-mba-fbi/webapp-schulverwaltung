import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';
import { TestsHeaderComponent } from '../tests-header/tests-header.component';

import { TestsListComponent } from './tests-list.component';
import { buildResult, buildTest } from '../../../../spec-builders';
import { TestEditGradesComponent } from '../test-edit-grades/test-edit-grades.component';
import { TestTableHeaderComponent } from '../test-table-header/test-table-header.component';
import { AverageGradesComponent } from '../grades/average-grades/average-grades.component';

describe('TestsListComponent', () => {
  let component: TestsListComponent;
  let fixture: ComponentFixture<TestsListComponent>;
  let stateServiceMock: TestStateService;
  let result = buildResult(12, 1);
  let test = buildTest(1234, 12, [result]);

  beforeEach(
    waitForAsync(() => {
      const course = buildCourse();
      course.EvaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };
      stateServiceMock = ({
        getCourse: () => of(course),
        setSorting: () => of({ key: 'FullName', ascending: true }),
        getSortingChar$: () => of('FullName'),
        loading$: of(false),
        tests$: of([test]),
        course$: of(course),
      } as unknown) as TestStateService;

      const reportServiceMock = jasmine.createSpyObj('reportService', [
        'getEventReportUrl',
      ]);
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [
            TestsListComponent,
            TestsHeaderComponent,
            TestEditGradesComponent,
            TestTableHeaderComponent,
            AverageGradesComponent,
          ],
          providers: [
            { provide: TestStateService, useValue: stateServiceMock },
            {
              provide: ReportsService,
              useValue: reportServiceMock as ReportsService,
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function buildCourse(): Course {
  return ({ Designation: 'course-designation' } as unknown) as Course;
}
