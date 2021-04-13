import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileLegalRepresentativeComponent } from './student-profile-legal-representative.component';
import { buildPerson } from 'src/spec-builders';

describe('StudentProfileLegalRepresentativeComponent', () => {
  let component: StudentProfileLegalRepresentativeComponent;
  let fixture: ComponentFixture<StudentProfileLegalRepresentativeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [StudentProfileLegalRepresentativeComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentProfileLegalRepresentativeComponent
    );
    component = fixture.componentInstance;
    component.person = buildPerson(123);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
