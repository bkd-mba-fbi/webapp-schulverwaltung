import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryDescriptionComponent } from "./student-dossier-entry-description.component";

describe("StudentDossierEntryDescriptionComponent", () => {
  let fixture: ComponentFixture<StudentDossierEntryDescriptionComponent>;
  let entry: StudentDossierEntry;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryDescriptionComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierEntryDescriptionComponent);
    element = fixture.debugElement.nativeElement;

    entry = {
      id: 1,
      type: "dossier",
      additionalInformation: {
        ...buildAdditionalInformation(),
        Description: "Lorem ipsum",
      },
      category: "Korrespondenz",
      isOwner: true,
    };
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();
  });

  it("renders a plain text description", () => {
    expect(element.children[0].innerHTML).toBe("Lorem ipsum");
  });

  it("sanitizes & renders HTML description", () => {
    entry.additionalInformation.Description =
      "<p>Lorem <i>ipsum</i></p> <script>alert('xss')</script>";
    fixture.componentRef.setInput("entry", { ...entry });
    fixture.detectChanges();

    expect(element.children[0].innerHTML).toBe("<p>Lorem <i>ipsum</i></p> ");
  });

  it("does not render description for email entry", () => {
    entry.additionalInformation.TypeId = 1055;
    fixture.componentRef.setInput("entry", { ...entry });
    fixture.detectChanges();

    expect(element.children.length).toBe(0);
    expect(element.textContent).toBe("");
  });
});
