import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Grade, GradingScale } from 'src/app/shared/models/grading-scale.model';
import { Test } from 'src/app/shared/models/test.model';
import { buildResult, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';

import { DossierSingleTestComponent } from './dossier-single-test.component';

describe('DossierSingleTestComponent', () => {
  let component: DossierSingleTestComponent;
  let fixture: ComponentFixture<DossierSingleTestComponent>;
  let debugElement: DebugElement;
  let test: Test;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierSingleTestComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    test = buildTest(1, 123, []);
    (test.Date = new Date('2022-02-22T00:00:00')),
      (fixture = TestBed.createComponent(DossierSingleTestComponent));
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.test = test;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show test designation', () => {
    expectText(
      debugElement,
      'test-designation',
      'Test Designation for test with id 123'
    );
  });

  it('should show test date', () => {
    expectText(debugElement, 'test-date', 'Feb 22, 2022'); // not sure how the date pipe works or how locales are handled in tests
  });

  it("should show '-' if no results are available in test", () => {
    expectText(debugElement, 'test-grade', '-');
  });

  it('should show grade from student', () => {
    const studentId = 999;
    const result = buildResult(123, studentId);
    result.GradeId = 1004;
    test.Results = [result, buildResult(123, 998)];
    const gradingScale = ({
      Grades: [
        ({ Id: 1001, Value: 1 } as unknown) as Grade,
        ({ Id: 1002, Value: 2 } as unknown) as Grade,
        ({ Id: 1003, Value: 3 } as unknown) as Grade,
        ({ Id: 1004, Value: 4 } as unknown) as Grade,
        ({ Id: 1005, Value: 5 } as unknown) as Grade,
        ({ Id: 1006, Value: 6 } as unknown) as Grade,
      ],
    } as unknown) as GradingScale;

    component.studentId = studentId;
    component.gradingScale = gradingScale;
    fixture.detectChanges();

    expectText(debugElement, 'test-grade', '4');
  });

  it('should show test summary (factor, weight)', () => {
    expectText(debugElement, 'test-factor', 'tests.factor 2 (50%)');
  });
});
