import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentDossierAbsencesComponent } from './student-dossier-absences.component';

describe('StudentDossierAbsencesComponent', () => {
  let component: StudentDossierAbsencesComponent;
  let fixture: ComponentFixture<StudentDossierAbsencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [StudentDossierAbsencesComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
