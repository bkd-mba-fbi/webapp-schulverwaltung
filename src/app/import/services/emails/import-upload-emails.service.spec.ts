import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ImportError } from "../common/import-state.service";
import { EmailEntry } from "./import-file-emails.service";
import { ImportUploadEmailsService } from "./import-upload-emails.service";
import { EmailImportEntry } from "./import-validate-emails.service";

describe("ImportUploadEmailsService", () => {
  let service: ImportUploadEmailsService;
  let personsServiceMock: jasmine.SpyObj<PersonsRestService>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: PersonsRestService,
            useFactory() {
              personsServiceMock = jasmine.createSpyObj("PersonsRestService", [
                "updateEmail",
              ]);

              personsServiceMock.updateEmail.and.returnValue(of(undefined));

              return personsServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(ImportUploadEmailsService);
  });

  describe("upload", () => {
    it("updates emails, marks them as success/error & updates progress, then retries", async () => {
      const entries: ReadonlyArray<EmailImportEntry> = [
        buildEntry(
          // Will succeed
          "s1-old@test.ch",
          { personId: 11, personEmail: "s1@test.ch" },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Will fail
          "s2-old@test.ch",
          { personId: 12, personEmail: "s2@test.ch" },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Unchanged value, will not be updated
          "s3@test.ch",
          { personId: 13, personEmail: "s3@test.ch" },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Invalid entry, should be ignored
          "s4-old@test.ch",
          { personId: 14, personEmail: "s4@test.ch" },
          { validationStatus: "invalid", importStatus: null },
        ),
      ];

      personsServiceMock.updateEmail.and.callFake((personId) =>
        personId === entries[1].entry.personId
          ? throwError(() => new Error("500 Internal Server Error"))
          : of(undefined),
      );

      // First attempt (with error)
      const resultEntries = await service.upload(entries);

      expect(personsServiceMock.updateEmail).toHaveBeenCalledTimes(2);

      const updatedValues = personsServiceMock.updateEmail.calls
        .allArgs()
        .map(([_, value]) => value);
      expect(new Set(updatedValues)).toEqual(
        new Set(["s1@test.ch", "s2@test.ch"]),
      );

      expect(resultEntries.length).toBe(4);
      let [entry1, entry2] = resultEntries;
      expect(entry1.importStatus).toBe("success");
      expect(entry1.importError).toBeNull();
      expect(entry2.importStatus).toBe("error");
      expect(entry2.importError).toBeInstanceOf(ImportError);

      expect(service.progress()).toEqual({
        uploading: 0,
        success: 2,
        error: 1,
        total: 3,
      });

      // Retry (this time without error)
      personsServiceMock.updateEmail.and.returnValue(of(undefined));
      personsServiceMock.updateEmail.calls.reset();
      const resultEntries2 = await service.upload(resultEntries, {
        retryFailedOnly: true,
      });

      expect(personsServiceMock.updateEmail).toHaveBeenCalledTimes(1);

      expect(resultEntries2.length).toBe(4);
      [entry1, entry2] = resultEntries2;
      expect(entry1.importStatus).toBe("success");
      expect(entry1.importError).toBeNull();
      expect(entry2.importStatus).toBe("success");
      expect(entry2.importError).toBeNull();

      expect(service.progress()).toEqual({
        uploading: 0,
        success: 3,
        error: 0,
        total: 3,
      });
    });
  });

  function buildEntry(
    currentEmail: string,
    { personId, personEmail }: EmailEntry,
    {
      validationStatus = "valid",
      importStatus = null,
    }: Pick<EmailImportEntry, "validationStatus" | "importStatus">,
  ): EmailImportEntry {
    return {
      entry: { personId, personEmail },
      data: {
        person: {
          Id: Number(personId),
          FullName: "Mr. Tux",
          Email: currentEmail,
          DisplayEmail: "",
        },
      },
      validationStatus,
      validationError: null,
      importStatus,
      importError: null,
    };
  }
});
