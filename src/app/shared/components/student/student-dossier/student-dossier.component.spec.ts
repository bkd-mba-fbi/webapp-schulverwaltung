import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import {
  StudentDossierEntry,
  StudentDossierService,
} from "src/app/shared/services/student-dossier.service";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentDossierComponent } from "./student-dossier.component";

describe("StudentDossierComponent", () => {
  let fixture: ComponentFixture<StudentDossierComponent>;
  let element: HTMLElement;
  let studentDossierServiceMock: {
    loading$: Observable<boolean>;
    studentId$: Observable<number>;
    informationEntries$: BehaviorSubject<ReadonlyArray<StudentDossierEntry>>;
    disadvantageEntries$: BehaviorSubject<ReadonlyArray<StudentDossierEntry>>;
    dossierEntries$: BehaviorSubject<ReadonlyArray<StudentDossierEntry>>;
  };

  beforeEach(async () => {
    studentDossierServiceMock = {
      loading$: of(false),
      studentId$: of(42),
      informationEntries$: new BehaviorSubject<
        ReadonlyArray<StudentDossierEntry>
      >([
        {
          id: 1,
          type: "information",
          additionalInformation: {
            ...buildAdditionalInformation(),
            CodeId: 2000274,
            Designation: "Epilepsie",
            Description:
              "Bei einem epileptischen Anfall ist folgendes zu tun...",
          },
          category: null,
          isOwner: false,
        },
      ]),
      disadvantageEntries$: new BehaviorSubject<
        ReadonlyArray<StudentDossierEntry>
      >([
        {
          id: 2,
          type: "disadvantage",
          additionalInformation: {
            ...buildAdditionalInformation(),
            CodeId: 2000283,
            Designation: "Dyslexie",
            Description: "20% mehr Zeit bei Prüfungen",
          },
          category: null,
          isOwner: false,
        },
      ]),
      dossierEntries$: new BehaviorSubject<ReadonlyArray<StudentDossierEntry>>([
        {
          id: 3,
          type: "dossier",
          additionalInformation: {
            ...buildAdditionalInformation(),
            Designation: "Anruf Eltern",
            Description: "Gemeinsames Verständnis geschaffen.",
            CreationDate: new Date(2000, 0, 23),
          },
          category: null,
          isOwner: false,
        },
        {
          id: 3,
          type: "dossier",
          additionalInformation: {
            ...buildAdditionalInformation(),
            Designation: "1. Verwarnung",
            CreationDate: new Date(2000, 0, 24),
          },
          category: null,
          isOwner: false,
        },
      ]),
    };

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [StudentDossierComponent],
        providers: [
          {
            provide: StudentDossierService,
            useValue: studentDossierServiceMock,
          },
        ],
      }),
    )
      .overrideComponent(StudentDossierComponent, {
        set: {
          providers: [
            {
              provide: StudentDossierService,
              useValue: studentDossierServiceMock,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(StudentDossierComponent);
    element = fixture.debugElement.nativeElement;
  });

  it("renders placeholder message if no entries are available", () => {
    studentDossierServiceMock.informationEntries$.next([]);
    studentDossierServiceMock.dossierEntries$.next([]);
    fixture.detectChanges();
    expect(element.textContent).toContain("student.dossier.no-entries");
  });

  it("renders information entry if available", () => {
    fixture.detectChanges();

    expect(element.textContent).not.toContain("student.dossier.no-entries");
    expect(element.textContent).toContain("student.dossier.information");
  });

  it("renders dossier entries if available", () => {
    fixture.detectChanges();

    expect(element.textContent).not.toContain("student.dossier.no-entries");
    expect(element.textContent).toContain("Anruf Eltern");
    expect(element.textContent).toContain("1. Verwarnung");
  });

  it("expands dossier entry and renders content", () => {
    fixture.detectChanges();

    expect(element.textContent).not.toContain(
      "Gemeinsames Verständnis geschaffen.",
    );

    const headers = Array.from(
      element.querySelectorAll<HTMLElement>(".accordion-header"),
    );
    const entryHeader = headers.find((h) =>
      h.textContent?.includes("Anruf Eltern"),
    );
    expect(entryHeader).toBeDefined();

    entryHeader?.querySelector<HTMLElement>("[role='button']")?.click();
    fixture.detectChanges();
    expect(element.textContent).toContain(
      "Gemeinsames Verständnis geschaffen.",
    );
    expect(element.textContent).toContain("23.01.2000");
  });
});
