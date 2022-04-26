import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Course } from 'src/app/shared/models/course.model';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestStateService } from '../../services/test-state.service';
import { TestsHeaderComponent } from '../tests-header/tests-header.component';

import { TestsListComponent } from './tests-list.component';

describe('TestsListComponent', () => {
  let component: TestsListComponent;
  let fixture: ComponentFixture<TestsListComponent>;
  let stateServiceMock: TestStateService;

  beforeEach(
    waitForAsync(() => {
      const course = buildCourse();
      stateServiceMock = ({
        loading$: of(false),
        getCourse: () => of(course),
      } as unknown) as TestStateService;

      const reportServiceMock = jasmine.createSpyObj('reportService', [
        'getEventReportUrl',
      ]);
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestsListComponent, TestsHeaderComponent],
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
