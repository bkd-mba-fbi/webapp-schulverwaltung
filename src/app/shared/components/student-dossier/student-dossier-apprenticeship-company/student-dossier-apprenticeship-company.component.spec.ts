import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  buildApprenticeshipContract,
  buildApprenticeshipManager,
  buildJobTrainer,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierApprenticeshipCompanyComponent } from "./student-dossier-apprenticeship-company.component";

describe("StudentDossierApprenticeshipCompanyComponent", () => {
  let component: StudentDossierApprenticeshipCompanyComponent;
  let fixture: ComponentFixture<StudentDossierApprenticeshipCompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierApprenticeshipCompanyComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentDossierApprenticeshipCompanyComponent,
    );
    component = fixture.componentInstance;
    component.company = {
      apprenticeshipContract: buildApprenticeshipContract(123, 10, 20),
      jobTrainer: buildJobTrainer(10),
      apprenticeshipManager: buildApprenticeshipManager(20),
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
