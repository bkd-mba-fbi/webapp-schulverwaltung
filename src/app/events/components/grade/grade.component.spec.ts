import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DropDownItem } from 'src/app/shared/models/drop-down-item.model';
import { GradeKind, NoResult } from 'src/app/shared/models/student-grades';
import { byTestId } from 'src/specs/utils';
import {
  buildResult,
  buildStudent,
  buildTest,
} from '../../../../spec-builders';
import { buildTestModuleMetadata } from '../../../../spec-helpers';
import { GradeComponent } from './grade.component';

describe('GradeComponent', () => {
  let component: GradeComponent;
  let fixture: ComponentFixture<GradeComponent>;
  let debugElement: DebugElement;

  const result = buildResult(120, 140);
  const test = buildTest(100, 120, [buildResult(120, 140)]);
  const student = buildStudent(5);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [GradeComponent],
      })
    ).compileComponents();

    fixture = TestBed.createComponent(GradeComponent);
    component = fixture.componentInstance;
    component.student = student;
    debugElement = fixture.debugElement;
  }));

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

  describe('tests without point grading', () => {
    let gradingScaleOptions: DropDownItem[];
    let grade: GradeKind;

    beforeEach(() => {
      gradingScaleOptions = [
        { Key: 1, Value: '1.0' },
        { Key: 2, Value: '2.0' },
        { Key: 3, Value: '3.0' },
        { Key: 4, Value: '4.0' },
        { Key: 5, Value: '5.0' },
        { Key: 6, Value: '6.0' },
      ];

      grade = {
        kind: 'grade',
        result,
        test,
      };
      grade.test.IsPointGrading = false;
      grade.result.Points = null;
      grade.result.GradeId = 4;
    });

    it('should show grading options and select grade from options', () => {
      // given
      component.grade = grade;
      component.gradeOptions = gradingScaleOptions;

      // when
      fixture.detectChanges();

      // then

      const select = debugElement.query(byTestId('grade-select')).nativeElement
        .firstChild;

      expect(select.options.length).toBe(7);
      expect(select.options[0].textContent?.trim()).toBe('');
      expect(select.options[1].textContent?.trim()).toBe('1.0');
      expect(select.options[2].textContent?.trim()).toBe('2.0');
      expect(select.options[3].textContent?.trim()).toBe('3.0');
      expect(select.options[4].textContent?.trim()).toBe('4.0');
      expect(select.options[5].textContent?.trim()).toBe('5.0');
      expect(select.options[6].textContent?.trim()).toBe('6.0');

      fixture.whenStable().then(() => {
        expect(select.selectedIndex).toBe(4);
      });
    });

    it('should show grading options without selection if there is no result yet', () => {
      // given
      const noResult: NoResult = {
        kind: 'no-result',
        test,
      };

      component.grade = noResult;
      component.gradeOptions = gradingScaleOptions;

      // when
      fixture.detectChanges();

      // then
      const select = debugElement.query(byTestId('grade-select')).nativeElement
        .firstChild;

      expect(select.options.length).toBe(7);
      expect(select.options[0].textContent.trim()).toBe('');
      expect(select.options[1].textContent.trim()).toBe('1.0');
      expect(select.options[2].textContent.trim()).toBe('2.0');
      expect(select.options[3].textContent.trim()).toBe('3.0');
      expect(select.options[4].textContent.trim()).toBe('4.0');
      expect(select.options[5].textContent.trim()).toBe('5.0');
      expect(select.options[6].textContent.trim()).toBe('6.0');

      fixture.whenStable().then(() => {
        expect(select.selectedIndex).toBe(0);
      });
    });
  });

  describe('tests with point gradings', () => {
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

    it('should show points in input field', () => {
      // given
      const grade: GradeKind = {
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

      fixture.whenStable().then(() => {
        expectPointsInputValue(debugElement, '11');
      });
    });
  });

  describe('enable and disable grading scale options', () => {
    let grade: GradeKind;

    beforeEach(() => {
      grade = {
        kind: 'grade',
        result,
        test,
      };
    });

    it('should disable gradingScale when result has points', () => {
      // given
      grade.test.IsPointGrading = true;
      grade.result.Points = 11;

      // when
      component.grade = grade;
      fixture.detectChanges();

      component.gradingScaleDisabled$.subscribe((result) =>
        expect(result).toBe(true)
      );
    });

    it('should enable gradingScale when result does not have points', () => {
      // given
      grade.test.IsPointGrading = true;
      grade.result.Points = null;
      component.grade = grade;

      // when
      fixture.detectChanges();

      component.gradingScaleDisabled$.subscribe((result) =>
        expect(result).toBe(false)
      );
    });

    it('should enable gradingScale when input is changed to empty', () => {
      // given
      grade.test.IsPointGrading = true;
      grade.result.Points = 11;

      component.grade = grade;
      fixture.detectChanges();

      // when
      component.onPointsChange('');

      // then
      component.gradingScaleDisabled$.subscribe((result) =>
        expect(result).toBe(false)
      );
    });

    it('should enable gradingScale when test is not point grading', () => {
      // given
      grade.test.IsPointGrading = false;
      grade.result.Points = null;

      component.grade = grade;

      // when
      fixture.detectChanges();

      // then
      component.gradingScaleDisabled$.subscribe((result) =>
        expect(result).toBe(false)
      );
    });
  });
});

function expectPointsInputValue(debugElement: DebugElement, expected: string) {
  const input = debugElement.query(byTestId('point-input')).nativeElement;
  expect(input.value).toBe(expected);
}

function expectValidationErrorMessage(debugElement: DebugElement) {
  const error = debugElement.query(
    byTestId('validation-error-message')
  ).nativeElement;

  expect(error.textContent).toContain('global.validation-errors.invalidPoints');
}
