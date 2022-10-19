import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentDossierLegalRepresentativeComponent } from './student-dossier-legal-representative.component';
import { buildPerson } from 'src/spec-builders';

describe('StudentDossierLegalRepresentativeComponent', () => {
  let component: StudentDossierLegalRepresentativeComponent;
  let fixture: ComponentFixture<StudentDossierLegalRepresentativeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [StudentDossierLegalRepresentativeComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentDossierLegalRepresentativeComponent
    );
    component = fixture.componentInstance;
    component.person = buildPerson(123);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
