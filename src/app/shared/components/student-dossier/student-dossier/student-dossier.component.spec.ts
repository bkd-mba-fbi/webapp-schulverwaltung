import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { DossierGradesService } from "src/app/shared/services/dossier-grades.service";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DossierStateService } from "../../../services/dossier-state.service";
import { StudentDossierComponent } from "./student-dossier.component";

describe("StudentDossierComponent", () => {
  let component: StudentDossierComponent;
  let fixture: ComponentFixture<StudentDossierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierComponent],
        providers: [
          {
            provide: DossierStateService,
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
            provide: DossierGradesService,
            useValue: {
              testReports$: of([]),
            },
          },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
