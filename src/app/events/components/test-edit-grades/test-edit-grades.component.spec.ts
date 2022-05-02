import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestEditGradesComponent } from './test-edit-grades.component';
import {
  expectElementPresent,
  expectNotInTheDocument,
} from '../../../../specs/expectations';
import { byTestId } from '../../../../specs/utils';
import { Course } from '../../../shared/models/course.model';
import { TestStateService } from '../../services/test-state.service';
import { of } from 'rxjs';

describe('TestEditGradesComponent', () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;
  let course: Course;
  let testStateServiceMock: TestStateService;

  course = buildCourse(1234);
  course.EvaluationStatusRef = {
    HasEvaluationStarted: true,
    EvaluationUntil: null,
    HasReviewOfEvaluationStarted: false,
    HasTestGrading: false,
    Id: 6980,
  };

  beforeEach(
    waitForAsync(() => {
      testStateServiceMock = ({
        course$: of(course),
        setSorting: () => of({ key: 'FullName', ascending: true }),
        getSortingChar$: () => of('FullName'),
      } as unknown) as TestStateService;

      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestEditGradesComponent],
          providers: [
            {
              provide: TestStateService,
              useValue: testStateServiceMock,
            },
          ],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGradesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button to set average as final grade', () => {
    fixture.detectChanges();
    expectElementPresent(fixture.debugElement, 'apply-average-button');
  });

  it('should hide button to set average as final grade', () => {
    course.EvaluationStatusRef.HasEvaluationStarted = false;
    fixture.detectChanges();
    expectNotInTheDocument(fixture.debugElement, 'apply-average-button');
  });

  it('should display external link to rating overview', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(byTestId('link-to-rating-overview'))
      .nativeElement as HTMLLinkElement;

    expect(link).not.toBeNull();
    expect(link.href).toBe(
      `http://localhost:9876/link-to-evaluation-module.aspx?IDAnlass=${course.Id}`
    );

    expectElementPresent(fixture.debugElement, 'link-to-rating-overview');
  });

  it('should hide external link to rating overview', () => {
    course.EvaluationStatusRef.HasEvaluationStarted = false;

    fixture.detectChanges();

    const link = fixture.debugElement.query(
      byTestId('link-to-rating-overview')
    );

    expect(link).toBeNull();
  });
});
