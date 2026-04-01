import { ComponentFixture, TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryHeaderComponent } from "./student-dossier-entry-header.component";

describe("StudentDossierEntryHeaderComponent", () => {
  let fixture: ComponentFixture<StudentDossierEntryHeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryHeaderComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierEntryHeaderComponent);
    element = fixture.debugElement.nativeElement;
    fixture.componentRef.setInput("icon", "notes");
    fixture.detectChanges();
  });

  it("renders the icon", () => {
    expect(element.querySelector(".material-icons-outlined")?.textContent).toBe(
      "notes",
    );
  });

  it("does not render the category badge if not available", () => {
    expect(element.querySelector(".badge")).toBeNull();
  });

  it("renders the category badge if available", () => {
    fixture.componentRef.setInput("category", "Korrespondenz");
    fixture.detectChanges();
    expect(element.querySelector(".badge")?.textContent?.trim()).toBe(
      "Korrespondenz",
    );
  });
});
