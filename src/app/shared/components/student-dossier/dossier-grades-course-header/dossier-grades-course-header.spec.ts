import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { Grade } from 'src/app/shared/models/grading-scale.model';
import { buildGradingScale } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesCourseHeaderComponent } from './dossier-grades-course-header.component';

describe('DossierGradesCourseHeaderComponent', () => {
  let component: DossierGradesCourseHeaderComponent;
  let fixture: ComponentFixture<DossierGradesCourseHeaderComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesCourseHeaderComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesCourseHeaderComponent);
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
    component.finalGrade = { Grade: '5.5' } as unknown as FinalGrading;
    component.gradingScale = buildGradingScale(1, [
      { Designation: 5.5 } as unknown as Grade,
    ]);
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 2 (5.5)');
  });

  it('should show designation and average', () => {
    component.designation = 'course 3';
    component.grading = { AverageTestResult: 5.2555 } as unknown as Grading;
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 3 (5.256)');
  });

  it('should show designation and only grade if both average and grade are set', () => {
    component.designation = 'course 4';
    component.grading = { AverageTestResult: 5.2555 } as unknown as Grading;
    component.finalGrade = { Grade: '5.5' } as unknown as FinalGrading;
    component.gradingScale = buildGradingScale(1, [
      { Designation: 5.5 } as unknown as Grade,
    ]);
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 4 (5.5)');
  });

  it('should only show designation if average is 0', () => {
    component.designation = 'course 5';
    component.grading = { AverageTestResult: 0 } as unknown as Grading;
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent).toBe('course 5');
  });
});
