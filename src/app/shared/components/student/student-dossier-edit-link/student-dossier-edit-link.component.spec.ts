import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEditLinkComponent } from "./student-dossier-edit-link.component";

describe("StudentDossierEditLinkComponent", () => {
  let fixture: ComponentFixture<StudentDossierEditLinkComponent>;
  let element: HTMLElement;
  let entry: StudentDossierEntry;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEditLinkComponent],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierEditLinkComponent);
    element = fixture.debugElement.nativeElement;
    entry = {
      id: 1,
      type: "dossier",
      additionalInformation: buildAdditionalInformation(),
      category: "2000267",
      isOwner: true,
    };
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();
  });

  it("shows edit link if is owner", () => {
    expect(element.querySelector("a")).not.toBeNull();
  });

  it("does not show edit link if is not owner", () => {
    fixture.componentRef.setInput("entry", { ...entry, isOwner: false });
    fixture.detectChanges();
    expect(element.querySelector("a")).toBeNull();
  });
});
