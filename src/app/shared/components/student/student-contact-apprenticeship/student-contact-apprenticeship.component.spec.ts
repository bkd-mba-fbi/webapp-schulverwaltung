import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apprenticeship } from "src/app/shared/services/student-profile.service";
import {
  buildApprenticeshipContract,
  buildApprenticeshipManager,
  buildJobTrainer,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentContactApprenticeshipComponent } from "./student-contact-apprenticeship.component";

describe("StudentContactApprenticeshipComponent", () => {
  let component: StudentContactApprenticeshipComponent;
  let fixture: ComponentFixture<StudentContactApprenticeshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentContactApprenticeshipComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentContactApprenticeshipComponent);
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
