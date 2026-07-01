import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { buildFinalGrading, buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  expectElementPresent,
  expectNotInTheDocument,
  expectText,
} from "src/specs/expectations";
import { StorageService } from "../../../services/storage.service";
import { StudentGradesService } from "../../../services/student-grades.service";
import { CourseWithGrades } from "../student-grades-accordion/student-grades-accordion.component";
import { StudentGradesCourseComponent } from "./student-grades-course.component";

describe("StudentGradesCourseComponent", () => {
  let fixture: ComponentFixture<StudentGradesCourseComponent>;
  let debugElement: DebugElement;

  let course: CourseWithGrades;
  let gradingScale: GradingScale;
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesCourseComponent],
        providers: [
          StudentGradesService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: "42" };
              },
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    course = { course: { Tests: [] } } as unknown as CourseWithGrades;
    gradingScale = {
      Grades: [],
    } as unknown as GradingScale;
    fixture = TestBed.createComponent(StudentGradesCourseComponent);
    fixture.componentRef.setInput("decoratedCourse", course);
    fixture.componentRef.setInput("gradingScales", [gradingScale]);

    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it("shows message course has no tests", () => {
    course = { course: { Tests: [] } } as unknown as CourseWithGrades;
    fixture.componentRef.setInput("decoratedCourse", course);
    fixture.detectChanges();
    expectText(debugElement, "message-no-tests", "student.grades.no-tests");
  });

  describe("edit icon", () => {
    beforeEach(() => {
      course.course.Tests = [buildTest(1, 1, [])];
      fixture.componentRef.setInput("studentId", 42);
    });

    describe("without final grades", () => {
      beforeEach(() => {
        course.course.FinalGrades = [];
        fixture.componentRef.setInput("decoratedCourse", { ...course });
      });

      it("shows edit icon when editable ", () => {
        fixture.componentRef.setInput("isEditable", true);
        fixture.detectChanges();
        expectElementPresent(debugElement, "test-grade-edit-icon");
      });

      it("hides edit icon when not editable", () => {
        fixture.componentRef.setInput("isEditable", false);
        fixture.detectChanges();
        expectNotInTheDocument(debugElement, "test-grade-edit-icon");
      });
    });

    describe("with final grades", () => {
      beforeEach(() => {
        course.course.FinalGrades = [buildFinalGrading(1)];
        fixture.componentRef.setInput("decoratedCourse", { ...course });
      });

      it("hides edit icon when editable ", () => {
        fixture.componentRef.setInput("isEditable", true);
        fixture.detectChanges();
        expectNotInTheDocument(debugElement, "test-grade-edit-icon");
      });

      it("hides edit icon when not editable", () => {
        fixture.componentRef.setInput("isEditable", false);
        fixture.detectChanges();
        expectNotInTheDocument(debugElement, "test-grade-edit-icon");
      });
    });
  });
});
