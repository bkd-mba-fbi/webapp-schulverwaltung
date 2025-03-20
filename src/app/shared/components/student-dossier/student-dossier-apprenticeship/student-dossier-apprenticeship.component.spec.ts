import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apprenticeship } from "src/app/shared/services/student-profile.service";
import {
  buildApprenticeshipContract,
  buildApprenticeshipManager,
  buildJobTrainer,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierApprenticeshipComponent } from "./student-dossier-apprenticeship.component";

describe("StudentDossierApprenticeshipComponent", () => {
  let component: StudentDossierApprenticeshipComponent;
  let fixture: ComponentFixture<StudentDossierApprenticeshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierApprenticeshipComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierApprenticeshipComponent);
    component = fixture.componentInstance;

    const apprenticeship: Apprenticeship = {
      apprenticeshipContract: buildApprenticeshipContract(123, 10, 20),
      jobTrainer: buildJobTrainer(10),
      apprenticeshipManager: buildApprenticeshipManager(20),
    };
    fixture.componentRef.setInput("apprenticeship", apprenticeship);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
