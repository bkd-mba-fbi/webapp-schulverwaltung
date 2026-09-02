import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FinalGrading, Grading } from "src/app/shared/models/course.model";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { expectText } from "src/specs/expectations";
import { StudentGradesFinalGradeComponent } from "./student-grades-final-grade.component";

describe("StudentGradesFinalGradeComponent", () => {
  let fixture: ComponentFixture<StudentGradesFinalGradeComponent>;
  let debugElement: DebugElement;

  let finalGrade: FinalGrading;
  let grading: Grading;
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesFinalGradeComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradesFinalGradeComponent);
    debugElement = fixture.debugElement;
    fixture.componentRef.setInput("average", 4);
  });

  it("should show values from finalGrade - GradeValue from FinalGrade", () => {
    finalGrade = { GradeValue: 4.5, Grade: "4.5" } as unknown as FinalGrading;
    fixture.componentRef.setInput("finalGrade", finalGrade);
    fixture.detectChanges();

    expectText(debugElement, "final-grade", "4.5");
  });

  it("should show average test result from gradings", () => {
    grading = { AverageTestResult: 4.233333 } as unknown as Grading;
    fixture.componentRef.setInput("grading", grading);
    fixture.componentRef.setInput("average", 4.233333);
    fixture.detectChanges();

    expectText(debugElement, "average-test-results", "4.233");
  });

  it("should show dash if average is zero", () => {
    fixture.componentRef.setInput("average", 0);
    fixture.detectChanges();
    expectText(debugElement, "average-test-results", "–");
  });
});
