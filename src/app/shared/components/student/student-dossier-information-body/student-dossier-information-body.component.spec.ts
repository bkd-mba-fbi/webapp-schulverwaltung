import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierInformationBodyComponent } from "./student-dossier-information-body.component";

describe("StudentDossierInformationBodyComponent", () => {
  let component: StudentDossierInformationBodyComponent;
  let fixture: ComponentFixture<StudentDossierInformationBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierInformationBodyComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierInformationBodyComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("informationEntries", []);
    fixture.componentRef.setInput("disadvantageEntries", []);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
