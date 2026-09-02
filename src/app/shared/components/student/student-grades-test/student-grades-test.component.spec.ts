import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Grade, GradingScale } from "src/app/shared/models/grading-scale.model";
import { Test } from "src/app/shared/models/test.model";
import { buildResult, buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  expectElementPresent,
  expectNotInTheDocument,
  expectText,
} from "src/specs/expectations";
import { StorageService } from "../../../services/storage.service";
import { StudentGradesService } from "../../../services/student-grades.service";
import { StudentGradesTestComponent } from "./student-grades-test.component";

describe("StudentGradesTestComponent", () => {
  let component: StudentGradesTestComponent;
  let fixture: ComponentFixture<StudentGradesTestComponent>;
  let debugElement: DebugElement;
  let test: Test;

  const testId = 123;
  const studentId = 10;
  const courseId = 12;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesTestComponent],
        providers: [
          StudentGradesService,
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj("StorageService", ["getPayload"]),
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradesTestComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;

    test = buildTest(1, testId, []);
    test.Date = new Date("2022-02-22T00:00:00");
    fixture.componentRef.setInput("studentId", studentId);
    fixture.componentRef.setInput("test", test);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show test designation", () => {
    expectText(
      debugElement,
      "test-designation",
      "Test Designation for test with id 123",
    );
  });

  it("should show test date", () => {
    expectText(debugElement, "test-date", "22.02.2022");
  });

  it("should show '–' if no results are available in test", () => {
    expectText(debugElement, "test-grade", "–");
  });

  it("should show test summary (factor, weight)", () => {
    expectText(debugElement, "test-factor", "tests.factor 2 (50%)");
  });

  it("should show the teacher's name", () => {
    fixture.componentRef.setInput("test", { ...test, Owner: "Stolz Zusanna" });

    fixture.detectChanges();
    expectText(debugElement, "test-teacher", "Stolz Zusanna");
  });

  it("should show the state of a published test", () => {
    fixture.componentRef.setInput("isEditable", true);
    fixture.componentRef.setInput("test", { ...test, IsPublished: true });

    fixture.detectChanges();
    expectText(debugElement, "test-status", "tests.published");
  });

  it("should show the state of a test not published yet", () => {
    fixture.componentRef.setInput("isEditable", true);
    fixture.componentRef.setInput("test", { ...test, IsPublished: false });

    fixture.detectChanges();
    expectText(debugElement, "test-status", "tests.not-published");
  });

  it("should hide the state of a test if isEditable flag is false", () => {
    fixture.componentRef.setInput("isEditable", false);
    fixture.componentRef.setInput("test", { ...test, IsPublished: false });

    fixture.detectChanges();
    expectNotInTheDocument(debugElement, "test-status");
  });

  it("should hide edit icon if teacher is not the owner", () => {
    fixture.componentRef.setInput("isEditable", true);
    fixture.componentRef.setInput("test", { ...test, IsOwner: false });

    fixture.detectChanges();
    expectNotInTheDocument(debugElement, "test-grade-edit-icon");
  });

  it("should show edit icon if teacher is the owner", () => {
    fixture.componentRef.setInput("isEditable", true);
    fixture.componentRef.setInput("test", { ...test, IsOwner: true });

    fixture.detectChanges();
    expectElementPresent(fixture.debugElement, "test-grade-edit-icon");
  });

  describe("grades and points", () => {
    beforeEach(() => {
      fixture.componentRef.setInput("studentId", studentId);
      const gradingScale = {
        Grades: [
          { Id: 1001, Value: 1, Designation: "1" } as unknown as Grade,
          { Id: 1002, Value: 2, Designation: "2" } as unknown as Grade,
          { Id: 1003, Value: 3, Designation: "3" } as unknown as Grade,
          { Id: 1004, Value: 4, Designation: "4" } as unknown as Grade,
          { Id: 1005, Value: 5, Designation: "5" } as unknown as Grade,
          { Id: 1006, Value: 6, Designation: "6" } as unknown as Grade,
        ],
      } as unknown as GradingScale;
      fixture.componentRef.setInput("gradingScale", gradingScale);

      const result = buildResult(123, studentId);
      result.GradeId = 1004;
      fixture.componentRef.setInput("test", {
        ...test,
        Results: [result, buildResult(123, 998)],
      });
      fixture.detectChanges();
    });

    it("should show grade from student", () => {
      expectText(debugElement, "test-grade", "4");
    });

    it("should show achieved and max points", () => {
      const result = buildResult(testId, studentId);
      result.Points = 22.5;
      test = buildTest(courseId, testId, [result]);
      test.IsPointGrading = true;
      test.IsPublished = true;
      test.MaxPoints = 27;
      fixture.componentRef.setInput("test", test);
      fixture.detectChanges();
      expectText(
        debugElement,
        "test-points",
        "22.5 / 27 student.grades.points",
      );
    });
  });
});
