import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../../../spec-helpers";
import { StudentDossierEntryHeaderComponent } from "./student-dossier-entry-header.component";

describe("StudentDossierEntryHeaderComponent", () => {
  let component: StudentDossierEntryHeaderComponent;
  let fixture: ComponentFixture<StudentDossierEntryHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryHeaderComponent],
      }),
    ).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDossierEntryHeaderComponent);
    component = fixture.componentInstance;
    StudentDossierEntryHeaderComponent;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
