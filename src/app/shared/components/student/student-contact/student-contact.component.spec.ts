import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentContactComponent } from "./student-contact.component";

describe("StudentContactComponent", () => {
  let component: StudentContactComponent;
  let fixture: ComponentFixture<StudentContactComponent>;
  let stateServiceMock: StudentStateService;

  beforeEach(async () => {
    stateServiceMock = {
      dossierPage: signal("contact"),
      studentId$: of(123),
      student$: of(buildStudent(123)),
      loadingStudent$: of(false),
      legalRepresentatives$: of([]),
      loadingLegalRepresentatives$: of(false),
      apprenticeships$: of([]),
      loadingApprenticeships$: of(false),
      returnParams$: of(""),
      backlinkQueryParams$: of({}),
    } as unknown as StudentStateService;

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentContactComponent],
        providers: [
          { provide: StudentStateService, useValue: stateServiceMock },
        ],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
