import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileAbsencesComponent } from './student-profile-absences.component';

describe('StudentProfileAbsencesComponent', () => {
  let component: StudentProfileAbsencesComponent;
  let fixture: ComponentFixture<StudentProfileAbsencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [StudentProfileAbsencesComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentProfileAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
