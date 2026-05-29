import { TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, firstValueFrom, of } from "rxjs";
import { skip } from "rxjs/operators";
import { buildAdditionalInformation, buildStudent } from "src/spec-builders";
import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import { AdditionalInformation } from "../models/additional-informations.model";
import { TokenPayload } from "../models/token-payload.model";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { StorageService } from "./storage.service";
import { StudentDossierFilterService } from "./student-dossier-filter.service";
import {
  StudentDossierEntry,
  StudentDossierService,
} from "./student-dossier.service";
import { StudentStateService } from "./student-state.service";
import { StudentsRestService } from "./students-rest.service";

describe("StudentDossierService", () => {
  let service: StudentDossierService;
  let studentsRestService: jasmine.SpyObj<StudentsRestService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let studentId$: BehaviorSubject<number>;

  beforeEach(() => {
    studentId$ = new BehaviorSubject(42);
    studentsRestService = jasmine.createSpyObj("StudentsRestService", [
      "getAdditionalInformations",
    ]);
    storageService = jasmine.createSpyObj("StorageService", ["getPayload"]);

    studentsRestService.getAdditionalInformations.and.returnValue(of([]));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StudentStateService,
            useValue: { studentId$, student$: of(buildStudent(42)) },
          },
          { provide: StudentsRestService, useValue: studentsRestService },
          {
            provide: DropDownItemsRestService,
            useValue: {
              getAdditionalInformationCodes: () =>
                of([
                  {
                    Key: 2000273,
                    Value: "Korrespondenz",
                    IsActive: true,
                    Sort: "1011",
                  },
                  {
                    Key: 2000275,
                    Value: "Zeugnis",
                    IsActive: true,
                    Sort: "1011",
                  },
                  {
                    Key: 2000272,
                    Value: "Gesuch",
                    IsActive: true,
                    Sort: "1011",
                  },
                  {
                    Key: 2000276,
                    Value: "Inaktiv",
                    IsActive: false,
                    Sort: "1011",
                  },
                  {
                    Key: 2000277,
                    Value: "Invalid Type",
                    IsActive: true,
                    Sort: "",
                  },
                ]),
            },
          },
          { provide: StorageService, useValue: storageService },
          StudentDossierFilterService,
        ],
      }),
    );
    service = TestBed.inject(StudentDossierService);
  });

  async function withEntries(
    infos: ReadonlyArray<AdditionalInformation>,
    entries$: Observable<ReadonlyArray<StudentDossierEntry>>,
    callback: (entries: ReadonlyArray<StudentDossierEntry>) => void,
  ) {
    studentsRestService.getAdditionalInformations.and.returnValue(of(infos));

    const promise = firstValueFrom(entries$.pipe(skip(1)));
    studentId$.next(42);
    const entries = await promise;
    callback(entries);
  }

  describe("entries$", () => {
    it("returns empty list when there are no additional informations", async () => {
      await withEntries([], service.entries$, (entries) => {
        expect(entries).toEqual([]);
      });
    });

    it("filters out entries with a null CodeId", async () => {
      const withCode = { ...buildAdditionalInformation() };
      const withoutCode = { ...buildAdditionalInformation(), CodeId: null };

      await withEntries(
        [withCode, withoutCode],
        service.entries$,
        (entries) => {
          expect(entries.length).toBe(1);
        },
      );
    });

    it("filters out entries with an unsupported TypeId", async () => {
      // Supported
      const informationType = { ...buildAdditionalInformation(), TypeId: 1052 };
      const reportType = { ...buildAdditionalInformation(), TypeId: 1054 };
      const emailType = { ...buildAdditionalInformation(), TypeId: 1055 };

      // Unsupported
      const openIssueType = { ...buildAdditionalInformation(), TypeId: 1053 };
      const technicalInfoType = {
        ...buildAdditionalInformation(),
        TypeId: 1056,
      };

      await withEntries(
        [
          informationType,
          reportType,
          emailType,
          openIssueType,
          technicalInfoType,
        ],
        service.entries$,
        (entries) => {
          expect(entries.map((e) => e.id)).toEqual([
            informationType.Id,
            reportType.Id,
            emailType.Id,
          ]);
        },
      );
    });

    it("sorts entries by CreationDate descending", async () => {
      const entry = {
        ...buildAdditionalInformation(),
        Id: 1,
        CreationDate: new Date("2024-01-01"),
      };
      const newerEntry = {
        ...buildAdditionalInformation(),
        Id: 2,
        CreationDate: new Date("2024-06-01"),
      };

      await withEntries([entry, newerEntry], service.entries$, (entries) => {
        expect(entries.map((e) => e.id)).toEqual([2, 1]);
      });
    });
  });

  describe("entry.type", () => {
    it("get entry type 'information' for dossierImportantInformationCodeId", async () => {
      const info = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierImportantInformationCodeId,
      };

      await withEntries([info], service.entries$, (entries) => {
        expect(entries[0].type).toBe("information");
      });
    });

    it("get entry type 'disadvantage' for dossierDisadvantageCompensationCodeId", async () => {
      const info = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierDisadvantageCompensationCodeId,
      };

      await withEntries([info], service.entries$, (entries) => {
        expect(entries[0].type).toBe("disadvantage");
      });
    });

    it("get entry type 'dossier' for other CodeId", async () => {
      await withEntries(
        [{ ...buildAdditionalInformation() }],
        service.entries$,
        (entries) => {
          expect(entries[0].type).toBe("dossier");
        },
      );
    });
  });

  describe("entry.category", () => {
    it("sets the matching category for the given CodeId", async () => {
      const entry = {
        ...buildAdditionalInformation(),
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].category).toBe("Korrespondenz");
      });
    });

    it("sets category to null if CodeId cannot be resolved", async () => {
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 9999,
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].category).toBeNull();
      });
    });
  });

  describe("entry.canEdit", () => {
    beforeEach(() => {
      const payload = {
        username: "testuser",
      } as unknown as TokenPayload;
      storageService.getPayload.and.returnValue(payload);
    });

    it("is false if category is allowed  but no token payload is available", async () => {
      storageService.getPayload.and.returnValue(null);
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 2000273,
        CreatorName: "testuser",
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].canEdit).toBe(false);
      });
    });

    it("is false if category is allowed but user is not the author", async () => {
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 2000273,
        CreatorName: "otheruser",
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].canEdit).toBe(false);
      });
    });

    it("is false if category is inactive", async () => {
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 2000276,
        CreatorName: "testuser",
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].canEdit).toBe(false);
      });
    });

    it("is false if category does not have required type", async () => {
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 2000277,
        CreatorName: "testuser",
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].canEdit).toBe(false);
      });
    });

    it("is true if category is allowed", async () => {
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 2000273,
        CreatorName: "testuser",
      };

      await withEntries([entry], service.entries$, (entries) => {
        expect(entries[0].canEdit).toBe(true);
      });
    });
  });

  describe("filteredDossierEntries$", () => {
    it("returns all dossier entries when no category is selected", () => {
      const korrespondenz = {
        ...buildAdditionalInformation(),
        Id: 1,
        CodeId: 2000273,
      };
      const zeugnis = {
        ...buildAdditionalInformation(),
        Id: 2,
        CodeId: 2000275,
      };

      studentsRestService.getAdditionalInformations.and.returnValue(
        of([korrespondenz, zeugnis]),
      );

      const callback = jasmine.createSpy("callback");
      service.filteredDossierEntries$.subscribe(callback);
      studentId$.next(42);

      const entries: ReadonlyArray<StudentDossierEntry> =
        callback.calls.mostRecent().args[0];

      expect(entries.map((e) => e.id)).toEqual([korrespondenz.Id, zeugnis.Id]);
    });

    it("returns only selected dossier entries when a category is selected", () => {
      const korrespondenz = {
        ...buildAdditionalInformation(),
        Id: 1,
        CodeId: 2000273,
      };
      const zeugnis = {
        ...buildAdditionalInformation(),
        Id: 2,
        CodeId: 2000275,
      };

      studentsRestService.getAdditionalInformations.and.returnValue(
        of([korrespondenz, zeugnis]),
      );

      const callback = jasmine.createSpy("callback");
      service.filteredDossierEntries$.subscribe(callback);
      studentId$.next(42);
      const filterService = TestBed.inject(StudentDossierFilterService);
      filterService.setSelectedCategories(["Zeugnis"]);

      const entries: ReadonlyArray<StudentDossierEntry> =
        callback.calls.mostRecent().args[0];
      expect(entries.map((e) => e.id)).toEqual([zeugnis.Id]);
    });
  });

  describe("entries by type", () => {
    it("informationEntries$ only returns information-type entries", async () => {
      const infoEntry = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierImportantInformationCodeId,
      };
      const dossierEntry = { ...buildAdditionalInformation() };

      await withEntries(
        [infoEntry, dossierEntry],
        service.informationEntries$,
        (entries) => {
          expect(entries.length).toBe(1);
          expect(entries[0].type).toBe("information");
        },
      );
    });

    it("disadvantageEntries$ only returns disadvantage-type entries", async () => {
      const disadvantageEntry = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierDisadvantageCompensationCodeId,
      };
      const dossierEntry = { ...buildAdditionalInformation() };

      await withEntries(
        [disadvantageEntry, dossierEntry],
        service.disadvantageEntries$,
        (entries) => {
          expect(entries.length).toBe(1);
          expect(entries[0].type).toBe("disadvantage");
        },
      );
    });

    it("dossierEntries$ only returns dossier-type entries", async () => {
      const infoEntry = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierImportantInformationCodeId,
      };
      const dossierEntry = { ...buildAdditionalInformation() };

      await withEntries(
        [infoEntry, dossierEntry],
        service.dossierEntries$,
        (entries) => {
          expect(entries.length).toBe(1);
          expect(entries[0].type).toBe("dossier");
        },
      );
    });
  });
});
