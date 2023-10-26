import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GradingScale } from "src/app/shared/models/grading-scale.model";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { expectText } from "src/specs/expectations";
import { DossierCourseTestsComponent } from "./dossier-course-tests.component";
import { DossierGradesService } from "../../../services/dossier-grades.service";
import { StorageService } from "../../../services/storage.service";
import { CourseWithGrades } from "../dossier-grades-view/dossier-grades-view.component";

describe("DossierCourseTestsComponent", () => {
  let component: DossierCourseTestsComponent;
  let fixture: ComponentFixture<DossierCourseTestsComponent>;
  let debugElement: DebugElement;

  let course: CourseWithGrades;
  let gradingScale: GradingScale;
  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        declarations: [DossierCourseTestsComponent],
        providers: [
          DossierGradesService,
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
    fixture = TestBed.createComponent(DossierCourseTestsComponent);
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
    expectText(debugElement, "message-no-tests", "dossier.no-tests");
  });
});
