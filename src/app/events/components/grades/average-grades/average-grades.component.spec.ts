import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Test } from 'src/app/shared/models/test.model';
import { buildResult, buildTest } from 'src/spec-builders';
import { expectNotInTheDocument, expectText } from 'src/specs/expectations';

import { AverageGradesComponent } from './average-grades.component';

describe('AverageGradesComponent', () => {
  let component: AverageGradesComponent;
  let fixture: ComponentFixture<AverageGradesComponent>;
  let test: Test;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AverageGradesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageGradesComponent);
    component = fixture.componentInstance;

    const result1 = buildResult(1, 2);
    result1.Points = 10;
    result1.GradeDesignation = '6';

    const result2 = buildResult(1, 2);
    result2.Points = 9;
    result2.GradeDesignation = '5.75';
    test = buildTest(1, 1, [result1, result2]);
    test.IsPointGrading = true;

    component.test = test;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show averages', () => {
    expectText(fixture.debugElement, 'average-points', '9.5');
    expectText(fixture.debugElement, 'average-grade', '5.875');
  });

  it('should not show points average if its not a point grading test', () => {
    test.IsPointGrading = false;
    component.test = test;
    fixture.detectChanges();

    expectNotInTheDocument(fixture.debugElement, 'average-points');
    expectText(fixture.debugElement, 'average-grade', '5.875');
  });

  it("should show '-' for tests with no results", () => {
    const testWithNoResults = buildTest(1, 1, []);
    testWithNoResults.IsPointGrading = true;
    component.test = testWithNoResults;
    fixture.detectChanges();

    expectText(fixture.debugElement, 'average-grade', '-');
    expectText(fixture.debugElement, 'average-points', '-');
  });
});
