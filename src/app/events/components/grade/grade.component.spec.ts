import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradeComponent } from './grade.component';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import {
  buildResult,
  buildStudent,
  buildTest,
} from '../../../../spec-builders';
import {
  Grade,
  GradeOrNoResult,
  NoResult,
} from 'src/app/shared/models/student-grades';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { byTestId } from 'src/specs/spec-utils';

describe('GradeComponent', () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;
  let debugElement: DebugElement;

  const result = buildResult(120, 140);
  const test = buildTest(100, 120, [buildResult(120, 140)]);
  const student = buildStudent(5);

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
    component.student = student;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    // given
    component.grade = {
      kind: 'grade',
      result,
      test,
    };
    // when
    fixture.detectChanges();

    // then
    expect(component).toBeTruthy();
  });

  describe('should show values (points and grade)', () => {
    it('should create with noResult', () => {
      // given
      const noResult: NoResult = {
        kind: 'no-result',
        test,
      };

      noResult.test.IsPointGrading = true;
      component.grade = noResult;

      // when
      fixture.detectChanges();

      expectPointsInputValue(debugElement, '');
    });

    it('should show points', () => {
      // given
      const grade: Grade = {
        kind: 'grade',
        result,
        test,
      };

      grade.test.IsPointGrading = true;
      grade.result.Points = 11;

      // when
      component.grade = grade;
      fixture.detectChanges();

      // then
      expectPointsInputValue(debugElement, '11');
    });
  });
  describe('points input validation', () => {
    let grade: Grade;

    beforeEach(() => {
      grade = {
        kind: 'grade',
        result,
        test,
      };

      grade.test.IsPointGrading = true;
      grade.result.Points = 12;
    });

    it('should show validation error if points are greater than maxPointsAdjusted', () => {
      // given
      grade.test.MaxPoints = 13;
      grade.test.MaxPointsAdjusted = 11;
      component.grade = grade;

      // when
      fixture.detectChanges();

      // then
      expectValidationErrorMessage(debugElement);
    });

    it('should show validation error if points are greater than maxPoints', () => {
      // given
      grade.test.MaxPoints = 11;
      grade.test.MaxPointsAdjusted = null;
      component.grade = grade;

      // when
      fixture.detectChanges();

      // then
      expectValidationErrorMessage(debugElement);
    });
  });
});

function expectPointsInputValue(debugElement: DebugElement, expected: string) {
  const input = debugElement.query(byTestId('point-input')).nativeElement;
  expect(input.value).toBe(expected);
}

function expectValidationErrorMessage(debugElement: DebugElement) {
  const error = debugElement.query(byTestId('validation-error-message'))
    .nativeElement;

  expect(error.textContent).toContain('global.validation-errors.invalidPoints');
}
