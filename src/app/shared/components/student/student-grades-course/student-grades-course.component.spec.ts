import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { expectText } from "src/specs/expectations";
import { StorageService } from "../../../services/storage.service";
import { StudentGradesService } from "../../../services/student-grades.service";
import { CourseWithGrades } from "../student-grades-accordion/student-grades-accordion.component";
import { StudentGradesCourseComponent } from "./student-grades-course.component";

describe("StudentGradesCourseComponent", () => {
  let component: StudentGradesCourseComponent;
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
    component = fixture.componentInstance;
    component.decoratedCourse = course;
    component.gradingScales = [gradingScale];

    fixture.detectChanges();
    debugElement = fixture.debugElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show message course has no tests", () => {
    course = { course: { Tests: [] } } as unknown as CourseWithGrades;
    component.decoratedCourse = course;
    fixture.detectChanges();
    expectText(debugElement, "message-no-tests", "student.grades.no-tests");
  });
});
