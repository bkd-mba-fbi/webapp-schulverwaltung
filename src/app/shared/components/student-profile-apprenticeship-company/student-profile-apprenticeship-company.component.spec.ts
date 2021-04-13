import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileApprenticeshipCompanyComponent } from './student-profile-apprenticeship-company.component';
import {
  buildApprenticeshipContract,
  buildApprenticeshipManager,
  buildJobTrainer,
} from 'src/spec-builders';

describe('StudentProfileApprenticeshipCompanyComponent', () => {
  let component: StudentProfileApprenticeshipCompanyComponent;
  let fixture: ComponentFixture<StudentProfileApprenticeshipCompanyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({
          declarations: [StudentProfileApprenticeshipCompanyComponent],
        })
      ).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentProfileApprenticeshipCompanyComponent
    );
    component = fixture.componentInstance;
    component.company = {
      apprenticeshipContract: buildApprenticeshipContract(123, 10, 20),
      jobTrainer: buildJobTrainer(10),
      apprenticeshipManager: buildApprenticeshipManager(20),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
