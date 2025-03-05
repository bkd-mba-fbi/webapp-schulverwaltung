import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { buildPersonSummary } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  EmailValidationError,
  InvalidPersonEmailError,
  InvalidPersonIdError,
  PersonNotFoundError,
} from "../../utils/emails/error";
import { EmailEntry } from "./import-file-emails.service";
import {
  EmailImportEntry,
  ImportValidateEmailsService,
} from "./import-validate-emails.service";

describe("ImportValidateEmailsService", () => {
  let service: ImportValidateEmailsService;
  let personsServiceMock: jasmine.SpyObj<PersonsRestService>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: PersonsRestService,
            useFactory() {
              personsServiceMock = jasmine.createSpyObj("PersonsRestService", [
                "getFullNamesById",
              ]);

              personsServiceMock.getFullNamesById.and.callFake((personIds) =>
                of(personIds.map((id) => buildPersonSummary(id))),
              );

              return personsServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(ImportValidateEmailsService);
  });
  describe("fetchAndValidate", () => {
    describe("data verification", () => {
      (
        [
          [{ personId: 100, personEmail: "s1@test.ch" }, null],
          [{ personId: "", personEmail: "s1@test.ch" }, InvalidPersonIdError],
          [{ personId: null, personEmail: "s1@test.ch" }, InvalidPersonIdError],
          [
            { personId: "foo", personEmail: "s1@test.ch" },
            InvalidPersonIdError,
          ],
          [{ personId: 100, personEmail: "" }, InvalidPersonEmailError],
          [{ personId: 100, personEmail: null }, InvalidPersonEmailError],
          [{ personId: 100, personEmail: "foo" }, InvalidPersonEmailError],
        ] as ReadonlyArray<[EmailEntry, Option<typeof EmailValidationError>]>
      ).forEach(([entry, expectedError]) => {
        const expectedStatus: EmailImportEntry["validationStatus"] =
          expectedError ? "invalid" : "valid";
        const expectedErrorName = expectedError?.name;

        it(`marks entry with ${JSON.stringify(entry)} as ${expectedStatus}${expectedErrorName ? ` with ${expectedErrorName}` : ""}`, async () => {
          const result = await service.fetchAndValidate([entry]);
          expect(result.length).toBe(1);
          expect(result[0].validationStatus).toBe(expectedStatus);
          if (expectedError === null) {
            expect(result[0].validationError).toBeNull();
          } else {
            expect(result[0].validationError).toBeInstanceOf(expectedError);
          }
        });
      });
    });

    describe("validation", () => {
      let entry: EmailEntry;

      beforeEach(() => {
        entry = { personId: 100, personEmail: "s1@test.ch" };
      });

      it("sets entry status to valid without error if all data is available & correct", async () => {
        await expectsValidEntry();
      });

      describe("person presence", () => {
        it("sets entry status to valid without error if person is present", async () => {
          await expectsValidEntry();
        });

        it("sets entry status to invalid with PersonNotFoundError if person is absent", async () => {
          personsServiceMock.getFullNamesById.and.returnValue(of([]));
          await expectsInvalidEntry(PersonNotFoundError);
        });
      });

      async function expectsValidEntry(): Promise<void> {
        const result = await service.fetchAndValidate([entry]);
        expect(result.length).toBe(1);
        expect(result[0].validationError).toBeNull();
        expect(result[0].validationStatus).toBe("valid");
      }

      async function expectsInvalidEntry(
        errorClass: typeof EmailValidationError,
      ): Promise<void> {
        const result = await service.fetchAndValidate([entry]);
        expect(result.length).toBe(1);
        expect(result[0].validationError).toBeInstanceOf(errorClass);
        expect(result[0].validationStatus).toBe("invalid");
      }
    });
  });
});
