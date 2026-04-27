import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { buildAdditionalInformation } from "src/spec-builders";
import { buildTestModuleMetadata, settings } from "src/spec-helpers";
import { TokenPayload } from "../models/token-payload.model";
import { DropDownItemsRestService } from "./drop-down-items-rest.service";
import { StorageService } from "./storage.service";
import { StudentDossierFilterService } from "./student-dossier-filter.service";
import { StudentDossierService } from "./student-dossier.service";
import { StudentStateService } from "./student-state.service";
import { StudentsRestService } from "./students-rest.service";

describe("StudentDossierService", () => {
  let service: StudentDossierService;
  let studentsRestService: jasmine.SpyObj<StudentsRestService>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
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
            useValue: { studentId$: of(42) },
          },
          { provide: StudentsRestService, useValue: studentsRestService },
          {
            provide: DropDownItemsRestService,
            useValue: {
              getAdditionalInformationCodes: () =>
                of([
                  { Key: 2000273, Value: "Korrespondenz" },
                  { Key: 2000275, Value: "Zeugnis" },
                  { Key: 2000272, Value: "Gesuch" },
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

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("entries$", () => {
    it("returns empty list when there are no additional informations", () => {
      service.entries$.subscribe((entries) => expect(entries).toEqual([]));
    });

    it("filters out entries with a null CodeId", () => {
      const withCode = { ...buildAdditionalInformation() };
      const withoutCode = { ...buildAdditionalInformation(), CodeId: null };
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([withCode, withoutCode]),
      );

      service.entries$.subscribe((entries) => expect(entries.length).toBe(1));
    });

    it("sorts entries by CreationDate descending", () => {
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
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([entry, newerEntry]),
      );

      service.entries$.subscribe((entries) =>
        expect(entries.map((e) => e.id)).toEqual([2, 1]),
      );
    });
  });

  describe("getEntryType", () => {
    it("get entry type 'information' for dossierImportantInformationCodeId", () => {
      const info = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierImportantInformationCodeId,
      };
      studentsRestService.getAdditionalInformations.and.returnValue(of([info]));

      service.entries$.subscribe((entries) =>
        expect(entries[0].type).toBe("information"),
      );
    });

    it("get entry type 'disadvantage' for dossierDisadvantageCompensationCodeId", () => {
      const info = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierDisadvantageCompensationCodeId,
      };
      studentsRestService.getAdditionalInformations.and.returnValue(of([info]));

      service.entries$.subscribe((entries) =>
        expect(entries[0].type).toBe("disadvantage"),
      );
    });

    it("get entry type 'dossier' for other CodeId", () => {
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([{ ...buildAdditionalInformation() }]),
      );

      service.entries$.subscribe((entries) =>
        expect(entries[0].type).toBe("dossier"),
      );
    });
  });

  describe("isOwner", () => {
    it("returns false when no token payload is available", () => {
      storageService.getPayload.and.returnValue(null);
      const info = {
        ...buildAdditionalInformation(),
        CreatorName: "testuser",
      };
      studentsRestService.getAdditionalInformations.and.returnValue(of([info]));

      service.entries$.subscribe((entries) =>
        expect(entries[0].isOwner).toBeFalse(),
      );
    });

    it("returns true when the token username matches the entry CreatorName", () => {
      const payload = {
        username: "testuser",
      } as unknown as TokenPayload;
      storageService.getPayload.and.returnValue(payload);
      const info = {
        ...buildAdditionalInformation(),
        CreatorName: "testuser",
      };
      studentsRestService.getAdditionalInformations.and.returnValue(of([info]));

      service.entries$.subscribe((entries) =>
        expect(entries[0].isOwner).toBeTrue(),
      );
    });

    it("returns false when the token username does not match the entry CreatorName", () => {
      const payload = {
        username: "otheruser",
      } as unknown as TokenPayload;
      storageService.getPayload.and.returnValue(payload);
      const info = {
        ...buildAdditionalInformation(),
        CreatorName: "testuser",
      };
      studentsRestService.getAdditionalInformations.and.returnValue(of([info]));

      service.entries$.subscribe((entries) =>
        expect(entries[0].isOwner).toBeFalse(),
      );
    });
  });

  describe("filtered entries", () => {
    it("informationEntries$ only returns information-type entries", () => {
      const infoEntry = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierImportantInformationCodeId,
      };
      const dossierEntry = { ...buildAdditionalInformation() };
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([infoEntry, dossierEntry]),
      );

      service.informationEntries$.subscribe((entries) => {
        expect(entries.length).toBe(1);
        expect(entries[0].type).toBe("information");
      });
    });

    it("disadvantageEntries$ only returns disadvantage-type entries", () => {
      const disadvantageEntry = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierDisadvantageCompensationCodeId,
      };
      const dossierEntry = { ...buildAdditionalInformation() };
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([disadvantageEntry, dossierEntry]),
      );

      service.disadvantageEntries$.subscribe((entries) => {
        expect(entries.length).toBe(1);
        expect(entries[0].type).toBe("disadvantage");
      });
    });

    it("dossierEntries$ only returns dossier-type entries", () => {
      const infoEntry = {
        ...buildAdditionalInformation(),
        CodeId: settings.dossierImportantInformationCodeId,
      };
      const dossierEntry = { ...buildAdditionalInformation() };
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([infoEntry, dossierEntry]),
      );

      service.dossierEntries$.subscribe((entries) => {
        expect(entries.length).toBe(1);
        expect(entries[0].type).toBe("dossier");
      });
    });
  });

  describe("category", () => {
    it("sets the matching category for the given CodeId", () => {
      const entry = {
        ...buildAdditionalInformation(),
      };
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([entry]),
      );

      service.entries$.subscribe((entries) => {
        expect(entries[0].category).toBe("Korrespondenz");
      });
    });

    it("sets category to null if CodeId does not match", () => {
      const entry = {
        ...buildAdditionalInformation(),
        CodeId: 9999,
      };
      studentsRestService.getAdditionalInformations.and.returnValue(
        of([entry]),
      );

      service.entries$.subscribe((entries) => {
        expect(entries[0].category).toBeNull();
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

      service.filteredDossierEntries$.subscribe((entries) => {
        expect(entries.map((e) => e.id)).toEqual([
          korrespondenz.Id,
          zeugnis.Id,
        ]);
      });
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

      TestBed.inject(StudentDossierFilterService).setSelectedCategories([
        "Zeugnis",
      ]);

      service.filteredDossierEntries$.subscribe((entries) => {
        expect(entries.map((e) => e.id)).toEqual([zeugnis.Id]);
      });
    });
  });
});
