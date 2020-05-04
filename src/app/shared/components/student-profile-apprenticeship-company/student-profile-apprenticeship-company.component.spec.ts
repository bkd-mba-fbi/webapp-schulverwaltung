import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileApprenticeshipCompanyComponent } from './student-profile-apprenticeship-company.component';
import { buildApprenticeshipContract, buildPerson } from 'src/spec-builders';

describe('StudentProfileApprenticeshipCompanyComponent', () => {
  let component: StudentProfileApprenticeshipCompanyComponent;
  let fixture: ComponentFixture<StudentProfileApprenticeshipCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [StudentProfileApprenticeshipCompanyComponent],
      })
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentProfileApprenticeshipCompanyComponent
    );
    component = fixture.componentInstance;
    component.company = {
      apprenticeshipContract: buildApprenticeshipContract(123, 10, 20),
      jobTrainerPerson: buildPerson(10),
      apprenticeshipManagerPerson: buildPerson(20),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
