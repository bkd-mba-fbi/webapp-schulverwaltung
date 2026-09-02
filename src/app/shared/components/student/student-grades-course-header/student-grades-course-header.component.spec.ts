import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildGradingScale } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentGradesCourseHeaderComponent } from "./student-grades-course-header.component";

describe("StudentGradesCourseHeaderComponent", () => {
  let fixture: ComponentFixture<StudentGradesCourseHeaderComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesCourseHeaderComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradesCourseHeaderComponent);
    debugElement = fixture.debugElement;
  });

  it("should show designation", () => {
    fixture.componentRef.setInput("designation", "course 1");
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 1",
    );
  });

  it("should show designation and grade", () => {
    fixture.componentRef.setInput("designation", "course 2");
    fixture.componentRef.setInput("finalGrade", { Grade: "5.5" });
    fixture.componentRef.setInput(
      "gradingScale",
      buildGradingScale(1, [
        { Id: 1, Designation: "5.5", Value: 5.5, Sort: "10", Sufficient: true },
      ]),
    );
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 2 (5.5)",
    );
  });

  it("should show designation and average", () => {
    fixture.componentRef.setInput("designation", "course 3");
    fixture.componentRef.setInput("average", 5.2555);
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 3 (5.256)",
    );
  });

  it("should show designation and only grade if both average and grade are set", () => {
    fixture.componentRef.setInput("designation", "course 4");
    fixture.componentRef.setInput("average", 5.2555);
    fixture.componentRef.setInput("finalGrade", { Grade: "5.5" });
    fixture.componentRef.setInput(
      "gradingScale",
      buildGradingScale(1, [
        { Id: 1, Designation: "5.5", Value: 5.5, Sort: "10", Sufficient: true },
      ]),
    );
    fixture.detectChanges();

    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 4 (5.5)",
    );
  });

  it("should only show designation if average is 0", () => {
    fixture.componentRef.setInput("designation", "course 5");
    fixture.componentRef.setInput("average", 0);

    fixture.detectChanges();
    expect(debugElement.nativeElement.textContent.replace("\n", "")).toBe(
      "course 5",
    );
  });
});
