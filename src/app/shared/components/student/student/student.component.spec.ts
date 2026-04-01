import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { StudentGradesService } from "src/app/shared/services/student-grades.service";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentStateService } from "../../../services/student-state.service";
import { StudentComponent } from "./student.component";

describe("StudentComponent", () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentComponent],
        providers: [
          {
            provide: StudentStateService,
            useValue: {
              dossierPage: signal("contact"),
              studentId$: of(1),
              student$: of(buildStudent(1)),
              loadingStudent$: of(false),
              legalRepresentatives$: of([]),
              loadingLegalRepresentatives$: of(false),
              apprenticeships$: of([]),
              loadingApprenticeships$: of(false),
              returnParams$: of(""),
              backlinkQueryParams$: of({}),
            },
          },
          {
            provide: StudentGradesService,
            useValue: {
              testReports$: of([]),
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
