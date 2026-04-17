import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryBodyComponent } from "./student-dossier-entry-body.component";

describe("StudentDossierEntryBodyComponent", () => {
  let fixture: ComponentFixture<StudentDossierEntryBodyComponent>;
  let element: HTMLElement;
  let entry: StudentDossierEntry;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryBodyComponent],
        providers: [
          {
            provide: StorageService,
            useValue: {
              getAccessToken: () => "ey...",
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(StudentDossierEntryBodyComponent);
    element = fixture.debugElement.nativeElement;

    entry = {
      id: 1,
      type: "dossier",
      additionalInformation: {
        ...buildAdditionalInformation(),
        Designation: "Anruf Eltern",
        Description: "Lorem ipsum",
        CreationDate: new Date(2000, 0, 23),
      },
      category: "Korrespondenz",
      isOwner: true,
    };
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();
  });

  it("renders the description", () => {
    expect(element.textContent).toContain("Lorem ipsum");
  });

  it("renders the creation info", () => {
    expect(element.textContent).toContain("23.01.2000, Max Mustermann");
  });

  describe("document link", () => {
    it("does not render a link if no file is available", () => {
      expect(element.querySelector("a")).toBeNull();
    });

    it("renders a link if a file is available", () => {
      entry.additionalInformation.File =
        "/restApi/Files/AdditionalInformation/1015/File";
      fixture.componentRef.setInput("entry", { ...entry });
      fixture.detectChanges();
      const link = element.querySelector("a");
      expect(link).not.toBeNull();
      expect(link?.href).toBe(
        "https://eventotest.api/Files/AdditionalInformation/1015/File?token=ey...",
      );
      expect(link?.target).toBe("_blank");
    });
  });
});
