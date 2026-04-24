import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierDeleteDialogComponent } from "./student-dossier-delete-dialog.component";

describe("StudentDossierDeleteComponent", () => {
  let component: StudentDossierDeleteDialogComponent;
  let fixture: ComponentFixture<StudentDossierDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierDeleteDialogComponent],
        providers: [NgbActiveModal],
      }),
    ).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierDeleteDialogComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
