import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentGradesService } from "src/app/shared/services/student-grades.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { buildCourse, buildGradingScale } from "../../../../../spec-builders";
import { StudentGradesComponent } from "./student-grades.component";

describe("StudentGradesComponent", () => {
  let component: StudentGradesComponent;
  let fixture: ComponentFixture<StudentGradesComponent>;

  let dossierStateServiceMock: StudentStateService;

  let dossierGradesServiceMock: StudentGradesService;

  beforeEach(async () => {
    dossierStateServiceMock = {
      studentId$: of(123),
    } as unknown as StudentStateService;

    dossierGradesServiceMock = {
      loading$: of(false),
      studentCourses$: of([buildCourse(1234)]),
      gradingScales$: of([buildGradingScale(1)]),
      setStudentId: jasmine.createSpy("setStudentId"),
      getFinalGradeForStudent: jasmine.createSpy("getFinalGradeForStudent"),
      getGradesForStudent: jasmine
        .createSpy("getGradesForStudent")
        .and.returnValue([]),
      getGradingForStudent: jasmine.createSpy("getGradingForStudent"),
      getGradingScaleOfCourse: jasmine.createSpy("getGradingScaleOfCourse"),
    } as unknown as StudentGradesService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentGradesComponent],
        providers: [
          { provide: StudentStateService, useValue: dossierStateServiceMock },
          {
            provide: StudentGradesService,
            useValue: dossierGradesServiceMock,
          },
          {
            provide: StorageService,
            useValue: jasmine.createSpyObj("StorageService", ["getPayload"]),
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
