import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import { PersonWithClassRegistration } from "src/app/shared/models/person.model";
import { TokenPayload } from "src/app/shared/models/token-payload.model";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentDossierEntry } from "src/app/shared/services/student-dossier.service";
import { StudentStateService } from "src/app/shared/services/student-state.service";
import { buildAdditionalInformation, buildPerson } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierEntryBodyComponent } from "./student-dossier-entry-body.component";

describe("StudentDossierEntryBodyComponent", () => {
  let fixture: ComponentFixture<StudentDossierEntryBodyComponent>;
  let element: HTMLElement;
  let entry: StudentDossierEntry;
  let studentStateServiceMock: {
    studentId$: BehaviorSubject<Option<number>>;
    student$: Observable<Option<PersonWithClassRegistration>>;
  };
  let storageServiceMock: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    studentStateServiceMock = {
      studentId$: new BehaviorSubject<Option<number>>(42),
      student$: of({
        ...buildPerson(42),
        FullName: "Berger Laura",
        ClassRegistrations: [],
      }),
    };
    storageServiceMock = jasmine.createSpyObj<StorageService>(
      "StorageService",
      ["getAccessToken", "getPayload"],
    );
    storageServiceMock.getAccessToken.and.returnValue("ey...");
    storageServiceMock.getPayload.and.returnValue({
      id_person: "123",
    } as unknown as TokenPayload);

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierEntryBodyComponent],
        providers: [
          { provide: StudentStateService, useValue: studentStateServiceMock },
          { provide: StorageService, useValue: storageServiceMock },
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
      canEdit: true,
    };
    fixture.componentRef.setInput("entry", entry);
    fixture.detectChanges();
  });

  it("renders the description", () => {
    expect(element.textContent).toContain("Lorem ipsum");
  });

  it("renders the creation date", () => {
    expect(element.textContent).toContain("23.01.2000");
  });

  describe("student visibility", () => {
    describe("as another user than the student of the dossier", () => {
      it("renders visibility text if ForStudent=true", () => {
        entry.additionalInformation.ForStudent = true;
        fixture.componentRef.setInput("entry", { ...entry });
        fixture.detectChanges();
        expect(element.textContent).toContain("student.dossier.visibility");
      });

      it("does not render visibility text if ForStudent=false", () => {
        entry.additionalInformation.ForStudent = false;
        fixture.componentRef.setInput("entry", { ...entry });
        fixture.detectChanges();
        expect(element.textContent).not.toContain("student.dossier.visibility");
      });
    });

    describe("as the student of the dossier", () => {
      beforeEach(() => {
        studentStateServiceMock.studentId$.next(123);
      });

      it("does not render visibility text if ForStudent=true", () => {
        entry.additionalInformation.ForStudent = true;
        fixture.componentRef.setInput("entry", { ...entry });
        fixture.detectChanges();
        expect(element.textContent).not.toContain("student.dossier.visibility");
      });

      it("does not render visibility text if ForStudent=false", () => {
        entry.additionalInformation.ForStudent = false;
        fixture.componentRef.setInput("entry", { ...entry });
        fixture.detectChanges();
        expect(element.textContent).not.toContain("student.dossier.visibility");
      });
    });
  });

  describe("document link", () => {
    it("does not render a link if no file is available", () => {
      expect(element.querySelector("a:not(.btn)")).toBeNull();
    });

    it("renders a link if a file is available", () => {
      const windowOpenSpy = spyOn(window, "open");
      entry.additionalInformation.File =
        "/restApi/Files/AdditionalInformation/1015/File";
      fixture.componentRef.setInput("entry", { ...entry });
      fixture.detectChanges();

      const link = element.querySelector<HTMLAnchorElement>("a:not(.btn)");
      expect(link).not.toBeNull();
      link?.click();

      expect(windowOpenSpy).toHaveBeenCalledWith(
        "https://eventotest.api/Files/AdditionalInformation/1015/File?token=ey...",
        "_blank",
      );
    });
  });
});
