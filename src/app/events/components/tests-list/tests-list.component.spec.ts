import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';
import { TestsHeaderComponent } from '../tests-header/tests-header.component';

import { TestsListComponent } from './tests-list.component';
import { buildCourse, buildResult, buildTest } from '../../../../spec-builders';
import { TestEditGradesComponent } from '../test-edit-grades/test-edit-grades.component';
import { TestTableHeaderComponent } from '../test-table-header/test-table-header.component';
import { AverageGradesComponent } from '../grades/average-grades/average-grades.component';
import { byTestId } from '../../../../specs/utils';
import { expectElementPresent } from '../../../../specs/expectations';

describe('TestsListComponent', () => {
  let component: TestsListComponent;
  let fixture: ComponentFixture<TestsListComponent>;
  let testStateServiceMock: TestStateService;
  let result = buildResult(12, 1);
  let test = buildTest(1234, 12, [result]);

  const course = buildCourse(1234);

  beforeEach(
    waitForAsync(() => {
      course.EvaluationStatusRef = {
        HasEvaluationStarted: false,
        EvaluationUntil: null,
        HasReviewOfEvaluationStarted: false,
        HasTestGrading: false,
        Id: 6980,
      };
      testStateServiceMock = ({
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
            { provide: TestStateService, useValue: testStateServiceMock },
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

  it('should display external link to rating overview', () => {
    testStateServiceMock.canSetFinalGrade$ = of(true);
    fixture.detectChanges();
    const link = fixture.debugElement.query(byTestId('link-to-rating-overview'))
      .nativeElement as HTMLLinkElement;

    expect(link).not.toBeNull();
    expect(link.href).toBe(
      `http://localhost:9876/link-to-evaluation-module.aspx?IDAnlass=${course.Id}`
    );

    expectElementPresent(fixture.debugElement, 'link-to-rating-overview');
  });
});
