import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradeComponent } from './grade.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { buildResult, buildTest } from '../../../../spec-builders';
import { GradeOrNoResult } from 'src/app/shared/models/student-grades';
import { By } from '@angular/platform-browser';

describe('GradeComponent', () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;

  const result = buildResult(120, 140);
  const test = buildTest(100, 120, [buildResult(120, 140)]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [GradeComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.grade = {
      kind: 'grade',
      result,
      test,
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create with noResult', () => {
    const noResult: GradeOrNoResult = {
      kind: 'no-result',
      test,
    };

    component.grade = noResult;

    expect(component).toBeTruthy();
    expect(component.grade).toBe(noResult);
  });

  it('should show points', () => {
    const grade: GradeOrNoResult = {
      kind: 'grade',
      result,
      test,
    };

    grade.test.IsPointGrading = true;
    grade.result.Points = 11;

    component.grade = grade;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.point-input'))
      .nativeElement;

    expect(input.value).toContain(11);
  });

  it('should show validation error if points are greater than maxPointsAdjusted', () => {
    const grade: GradeOrNoResult = {
      kind: 'grade',
      result,
      test,
    };

    grade.test.IsPointGrading = true;
    grade.test.MaxPoints = 13;
    grade.test.MaxPointsAdjusted = 11;
    grade.result.Points = 12;

    component.grade = grade;
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.invalid-feedback');

    expect(error.textContent).toContain(
      'global.validation-errors.invalidPoints'
    );
  });

  it('should show validation error if points are greater than maxPoints', () => {
    const grade: GradeOrNoResult = {
      kind: 'grade',
      result,
      test,
    };

    grade.test.IsPointGrading = true;
    grade.test.MaxPoints = 11;
    grade.test.MaxPointsAdjusted = null;
    grade.result.Points = 12;

    component.grade = grade;
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.invalid-feedback');

    expect(error.textContent).toContain(
      'global.validation-errors.invalidPoints'
    );
  });
});
