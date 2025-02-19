import { TestBed } from "@angular/core/testing";
import { SubscriptionDetailEntry } from "./import-file-subscription-details.service";
import {
  ImportValidateSubscriptionDetailsService,
  InvalidEventIdError,
  InvalidPersonEmailError,
  InvalidPersonIdError,
  InvalidSubscriptionDetailIdError,
  MissingPersonIdEmailError,
  MissingValueError,
  SubscriptionDetailImportEntry,
  SubscriptionDetailValidationError,
} from "./import-validate-subscription-details.service";

describe("ImportValidateSubscriptionDetailsService", () => {
  let service: ImportValidateSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidateSubscriptionDetailsService);
  });

  describe("fetchAndValidate", () => {
    describe("data verification", () => {
      (
        [
          [{ eventId: 1234 }, null],
          [{ eventId: "" }, InvalidEventIdError],
          [{ eventId: null }, InvalidEventIdError],
          [{ eventId: "foo" }, InvalidEventIdError],
          [{ personId: 1234 }, null],
          [{ personId: "" }, null],
          [{ personId: null }, null],
          [{ personId: "foo" }, InvalidPersonIdError],
          [{ personEmail: "s1@test.ch" }, null],
          [{ personEmail: "" }, null],
          [{ personEmail: null }, null],
          [{ personEmail: "foo" }, InvalidPersonEmailError],
          [{ personId: 1234, personEmail: "s1@test.ch" }, null],
          [{ personId: 1234, personEmail: null }, null],
          [{ personId: null, personEmail: "s1@test.ch" }, null],
          [{ personId: null, personEmail: null }, MissingPersonIdEmailError],
          [{ subscriptionDetailId: 1234 }, null],
          [{ subscriptionDetailId: "" }, InvalidSubscriptionDetailIdError],
          [{ subscriptionDetailId: null }, InvalidSubscriptionDetailIdError],
          [{ subscriptionDetailId: "foo" }, InvalidSubscriptionDetailIdError],
          [{ value: "foo" }, null],
          [{ value: 1234 }, null],
          [{ value: "" }, MissingValueError],
          [{ value: null }, MissingValueError],
        ] as ReadonlyArray<
          [
            Parameters<typeof buildEntry>[0],
            Option<typeof SubscriptionDetailValidationError>,
          ]
        >
      ).forEach(([data, expectedError]) => {
        const expectedStatus: SubscriptionDetailImportEntry["validationStatus"] =
          expectedError ? "invalid" : "valid";
        const expectedErrorName = expectedError?.name;

        it(`marks entry with ${JSON.stringify(data)} as ${expectedStatus}${expectedErrorName ? ` with ${expectedErrorName}` : ""}`, async () => {
          const entry = buildEntry(data);
          const { progress, entries } = service.fetchAndValidate([entry]);
          const result = await entries;
          expect(result[0].validationStatus).toBe(expectedStatus);

          if (expectedError === null) {
            expect(result[0].validationError).toBeNull();
            expect(progress()).toEqual({
              validating: 0,
              valid: 1,
              invalid: 0,
              total: 1,
            });
          } else {
            expect(result[0].validationError).toBeInstanceOf(expectedError);
            expect(progress()).toEqual({
              validating: 0,
              valid: 0,
              invalid: 1,
              total: 1,
            });
          }
        });
      });
    });
  });

  function buildEntry({
    eventId = 10,
    personId = 100,
    personEmail = "s1@test.ch",
    subscriptionDetailId = 1000,
    value = "test",
  }: Partial<SubscriptionDetailEntry>): SubscriptionDetailEntry {
    return { eventId, personId, personEmail, subscriptionDetailId, value };
  }
});
