import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbAccordionDirective } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierInformationComponent } from "./student-dossier-information.component";

describe("StudentDossierInformationComponent", () => {
  let component: StudentDossierInformationComponent;
  let fixture: ComponentFixture<StudentDossierInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierInformationComponent],
        providers: [NgbAccordionDirective],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
