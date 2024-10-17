import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildPerson } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierLegalRepresentativeComponent } from "./student-dossier-legal-representative.component";

describe("StudentDossierLegalRepresentativeComponent", () => {
  let component: StudentDossierLegalRepresentativeComponent;
  let fixture: ComponentFixture<StudentDossierLegalRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierLegalRepresentativeComponent],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      StudentDossierLegalRepresentativeComponent,
    );
    component = fixture.componentInstance;
    component.person = buildPerson(123);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
