import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbAccordionDirective } from "@ng-bootstrap/ng-bootstrap";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryComponent } from "./student-dossier-entry.component";

describe("StudentDossierEntryComponent", () => {
  let fixture: ComponentFixture<StudentDossierEntryComponent>;
  let entry: StudentDossierEntry;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryComponent],
        providers: [NgbAccordionDirective],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierEntryComponent);
    element = fixture.debugElement.nativeElement;

    entry = {
      id: 1,
      type: "dossier",
      additionalInformation: buildAdditionalInformation(),
      category: "Korrespondenz",
      isOwner: true,
    };
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();
  });

  it("renders a file icon if the entry has a file", () => {
    entry.additionalInformation.File = "http://example.com/document.pdf";
    fixture.componentRef.setInput("entry", { ...entry });
    fixture.detectChanges();

    expect(
      element.querySelector(".material-icons-outlined")?.textContent?.trim(),
    ).toBe("insert_drive_file");
  });

  it("renders a notes icon if the entry does not have a file", () => {
    expect(
      element.querySelector(".material-icons-outlined")?.textContent?.trim(),
    ).toBe("notes");
  });

  it("renders the designation", () => {
    expect(element.textContent).toContain("Lorem ipsum");
  });
});
