import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalGrading, Grading } from 'src/app/shared/models/course.model';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { expectText } from 'src/specs/expectations';

import { DossierGradesFinalGradeComponent } from './dossier-grades-final-grade.component';

describe('DossierGradesFinalGradeComponent', () => {
  let component: DossierGradesFinalGradeComponent;
  let fixture: ComponentFixture<DossierGradesFinalGradeComponent>;
  let debugElement: DebugElement;

  let finalGrade: FinalGrading;
  let grading: Grading;
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierGradesFinalGradeComponent],
      })
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DossierGradesFinalGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;

    finalGrade = ({
      Grade: '4.5',
    } as unknown) as FinalGrading;

    grading = ({ AverageTestResult: 4.233333 } as unknown) as Grading;
    component.finalGrade = finalGrade;
    component.grading = grading;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show values from finalGrade', () => {
    expectText(debugElement, 'final-grade', '4.5');
  });

  it('should show average test result from gradings', () => {
    expectText(debugElement, 'average-test-results', '4.233');
  });
});
