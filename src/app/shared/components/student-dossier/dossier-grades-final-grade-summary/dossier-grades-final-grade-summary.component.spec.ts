import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { Grade } from 'src/app/shared/models/grading-scale.model';
import { buildGradingScale } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesFinalGradeSummaryComponent } from './dossier-grades-final-grade-summary.component';

describe('DossierGradesFinalGradeSummaryComponent', () => {
  let component: DossierGradesFinalGradeSummaryComponent;
  let fixture: ComponentFixture<DossierGradesFinalGradeSummaryComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesFinalGradeSummaryComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesFinalGradeSummaryComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show designation', () => {
    component.designation = 'course 1';
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 1');
  });

  it('should show designation and grade', () => {
    component.designation = 'course 2';
    component.finalGrade = ({ Grade: '5.5' } as unknown) as FinalGrading;
    component.gradingScale = buildGradingScale(1, [
      ({ Value: 5.5 } as unknown) as Grade,
    ]);
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 2 (5.5)');
  });

  it('should show designation and average', () => {
    component.designation = 'course 3';
    component.grading = ({ AverageTestResult: 5.2555 } as unknown) as Grading;
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 3 (5.256)');
  });
});
