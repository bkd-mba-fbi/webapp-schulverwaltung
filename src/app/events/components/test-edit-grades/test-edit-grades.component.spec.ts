import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { buildCourse, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestEditGradesComponent } from './test-edit-grades.component';
import {
  expectElementPresent,
  expectNotInTheDocument,
} from '../../../../specs/expectations';
import { byTestId } from '../../../../specs/utils';
import { Course } from '../../../shared/models/course.model';

describe('TestEditGradesComponent', () => {
  let component: TestEditGradesComponent;
  let fixture: ComponentFixture<TestEditGradesComponent>;
  let course: Course;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [TestEditGradesComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEditGradesComponent);
    component = fixture.componentInstance;

    course = buildCourse(1234);
    course.EvaluationStatusRef = {
      HasEvaluationStarted: true,
      EvaluationUntil: null,
      HasReviewOfEvaluationStarted: false,
      HasTestGrading: false,
      Id: 6980,
    };

    component.course = course;
    component.tests = [buildTest(1234, 12, [])];
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
