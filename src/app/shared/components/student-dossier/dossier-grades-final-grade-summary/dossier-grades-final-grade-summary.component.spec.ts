import { ComponentFixture, TestBed } from '@angular/core/testing';
import { buildCourse } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesFinalGradeSummaryComponent } from './dossier-grades-final-grade-summary.component';

describe('DossierGradesFinalGradeSummaryComponent', () => {
  let component: DossierGradesFinalGradeSummaryComponent;
  let fixture: ComponentFixture<DossierGradesFinalGradeSummaryComponent>;

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
    component.course = buildCourse(1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
