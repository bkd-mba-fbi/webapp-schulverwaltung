import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import {
  SubscriptionDetail,
  SubscriptionDetailType,
} from "src/app/shared/models/subscription.model";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import {
  buildEvent,
  buildPersonSummary,
  buildSubscriptionDetail,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import {
  EventNotFoundError,
  InvalidDropdownValueError,
  InvalidEventIdError,
  InvalidPersonEmailError,
  InvalidPersonIdError,
  InvalidSubscriptionDetailIdError,
  InvalidValueTypeError,
  MissingPersonIdEmailError,
  MissingValueError,
  PersonNotFoundError,
  SubscriptionDetailNotEditableError,
  SubscriptionDetailNotFoundError,
  SubscriptionDetailValidationError,
} from "../../utils/subscription-details/error";
import { SubscriptionDetailEntry } from "./import-file-subscription-details.service";
import {
  ImportValidateSubscriptionDetailsService,
  SubscriptionDetailImportEntry,
} from "./import-validate-subscription-details.service";

describe("ImportValidateSubscriptionDetailsService", () => {
  let service: ImportValidateSubscriptionDetailsService;
  let eventsServiceMock: jasmine.SpyObj<EventsRestService>;
  let personsServiceMock: jasmine.SpyObj<PersonsRestService>;
  let subscriptionsServiceMock: jasmine.SpyObj<SubscriptionsRestService>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: EventsRestService,
            useFactory() {
              eventsServiceMock = jasmine.createSpyObj("EventsRestService", [
                "getEventDesignations",
              ]);

              eventsServiceMock.getEventDesignations.and.callFake((eventIds) =>
                of(eventIds.map((id) => buildEvent(id))),
              );

              return eventsServiceMock;
            },
          },
          {
            provide: PersonsRestService,
            useFactory() {
              personsServiceMock = jasmine.createSpyObj("PersonsRestService", [
                "getFullNamesById",
                "getSummariesByEmail",
              ]);

              personsServiceMock.getFullNamesById.and.callFake((personIds) =>
                of(personIds.map((id) => buildPersonSummary(id))),
              );
              personsServiceMock.getSummariesByEmail.and.callFake(
                (personEmails) =>
                  of(
                    personEmails.map((email, i) => {
                      const summary = buildPersonSummary(100 + i);
                      summary.DisplayEmail = email;
                      return summary;
                    }),
                  ),
              );

              return personsServiceMock;
            },
          },
          {
            provide: SubscriptionsRestService,
            useFactory() {
              subscriptionsServiceMock = jasmine.createSpyObj(
                "SubscriptionsRestService",
                [
                  "getSubscriptionIdsByEventAndStudents",
                  "getSubscriptionDetailsById",
                ],
              );

              subscriptionsServiceMock.getSubscriptionIdsByEventAndStudents.and.callFake(
                (eventId, personIds) =>
                  of(personIds.map((personId) => eventId * 100 + personId)),
              );
              subscriptionsServiceMock.getSubscriptionDetailsById.and.callFake(
                (subscriptionId) =>
                  of([buildSubscriptionDetailWithValue(subscriptionId)]),
              );

              return subscriptionsServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(ImportValidateSubscriptionDetailsService);
  });

  describe("fetchAndValidate", () => {
    describe("data verification", () => {
      (
        [
          [{ eventId: 10 }, null],
          [{ eventId: "" }, InvalidEventIdError],
          [{ eventId: null }, InvalidEventIdError],
          [{ eventId: "foo" }, InvalidEventIdError],
          [{ personId: 100 }, null],
          [{ personId: "" }, null],
          [{ personId: null }, null],
          [{ personId: "foo" }, InvalidPersonIdError],
          [{ personEmail: "s1@test.ch" }, null],
          [{ personEmail: "" }, null],
          [{ personEmail: null }, null],
          [{ personEmail: "foo" }, InvalidPersonEmailError],
          [{ personId: 100, personEmail: "s1@test.ch" }, null],
          [{ personId: 100, personEmail: null }, null],
          [{ personId: null, personEmail: "s1@test.ch" }, null],
          [{ personId: null, personEmail: null }, MissingPersonIdEmailError],
          [{ subscriptionDetailId: 1100000 }, null],
          [{ subscriptionDetailId: "" }, InvalidSubscriptionDetailIdError],
          [{ subscriptionDetailId: null }, InvalidSubscriptionDetailIdError],
          [{ subscriptionDetailId: "foo" }, InvalidSubscriptionDetailIdError],
          [{ value: "Lorem ipsum" }, null],
          // [{ value: 1234 }, null],
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
      let entry: SubscriptionDetailEntry;

      beforeEach(() => {
        entry = buildEntry({});
      });

      it("sets entry status to valid without error if all data is available & correct", async () => {
        await expectsValidEntry();
      });

      describe("event presence", () => {
        it("sets entry status to invalid with EventNotFoundError if event is absent", async () => {
          eventsServiceMock.getEventDesignations.and.returnValue(of([]));
          await expectsInvalidEntry(EventNotFoundError);
        });
      });

      describe("person presence", () => {
        it("sets entry status to valid without error if person is present by ID", async () => {
          personsServiceMock.getSummariesByEmail.and.returnValue(of([]));
          await expectsValidEntry();
        });

        it("sets entry status to valid without error if person is present by email", async () => {
          personsServiceMock.getFullNamesById.and.returnValue(of([]));
          await expectsValidEntry();
        });

        it("sets entry status to invalid with PersonNotFoundError if person is absent", async () => {
          personsServiceMock.getFullNamesById.and.returnValue(of([]));
          personsServiceMock.getSummariesByEmail.and.returnValue(of([]));
          await expectsInvalidEntry(PersonNotFoundError);
        });
      });

      describe("subscription & subscription detail presence", () => {
        it("sets entry status to invalid with SubscriptionDetailNotFoundError if subscription is absent", async () => {
          subscriptionsServiceMock.getSubscriptionIdsByEventAndStudents.and.returnValue(
            of([]),
          );
          await expectsInvalidEntry(SubscriptionDetailNotFoundError);
        });

        it("sets entry status to invalid with SubscriptionDetailNotFoundError if subscription detail is absent", async () => {
          subscriptionsServiceMock.getSubscriptionDetailsById.and.returnValue(
            of([]),
          );
          await expectsInvalidEntry(SubscriptionDetailNotFoundError);
        });
      });

      describe("editable via internet", () => {
        it("sets entry status to valid without error if subscription detail's VSSInternet is 'E'", async () => {
          mockSubscriptionDetail({
            VssInternet: "E",
          });
          await expectsValidEntry();
        });

        it("sets entry status to invalid with SubscriptionDetailNotEditableError if subscription detail's VSSInternet is not 'E'", async () => {
          mockSubscriptionDetail({
            VssInternet: "X",
          });
          await expectsInvalidEntry(SubscriptionDetailNotEditableError);
        });
      });

      describe("value type", () => {
        it("sets entry status to valid without error for int Int type with int value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Int,
          });
          entry.value = 42;
          await expectsValidEntry();
        });

        it("sets entry status to invalid with InvalidValueTypeError Int type with float value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Int,
          });
          entry.value = 1.25;
          await expectsInvalidEntry(InvalidValueTypeError);
        });

        it("sets entry status to invalid with InvalidValueTypeError for Int type with string value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Int,
          });
          entry.value = "Lorem ipsum";
          await expectsInvalidEntry(InvalidValueTypeError);
        });

        it("sets entry status to valid without error for Currency type with int value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Currency,
          });
          entry.value = 42;
          await expectsValidEntry();
        });

        it("sets entry status to valid without error for Currency type with float value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Currency,
          });
          entry.value = 1.25;
          await expectsValidEntry();
        });

        it("sets entry status to invalid with InvalidValueTypeError for Currency type with string value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Currency,
          });
          entry.value = "Lorem ipsum";
          await expectsInvalidEntry(InvalidValueTypeError);
        });

        it("sets entry status to valid without error for ShortText type with string value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.ShortText,
          });
          entry.value = "Lorem ipsum";
          await expectsValidEntry();
        });

        it("sets entry status to invalid with InvalidValueTypeError for ShortText type with number value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.ShortText,
          });
          entry.value = 42;
          await expectsInvalidEntry(InvalidValueTypeError);
        });

        it("sets entry status to valid without error for Text type with string value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Text,
          });
          entry.value = "Lorem ipsum";
          await expectsValidEntry();
        });

        it("sets entry status to invalid with InvalidValueTypeError for Text type with number value", async () => {
          mockSubscriptionDetail({
            VssTypeId: SubscriptionDetailType.Text,
          });
          entry.value = 42;
          await expectsInvalidEntry(InvalidValueTypeError);
        });

        it("sets entry status to invalid with InvalidValueTypeError for unsupported YesNo type", async () => {
          mockSubscriptionDetail({
            VssTypeId: 291, // YesNo
          });
          await expectsInvalidEntry(InvalidValueTypeError);
        });
      });

      describe("dropdown items", () => {
        it("sets entry status to valid without error for any value if the subscription detail has no dropdown items", async () => {
          mockSubscriptionDetail({
            DropdownItems: null,
          });
          entry.value = "Lorem ipsum";
          await expectsValidEntry();
        });

        it("sets entry status to valid without error for existing dropdown item", async () => {
          mockSubscriptionDetail({
            DropdownItems: [
              { Key: 1, Value: "Apple", IsActive: true },
              { Key: 2, Value: "Pear", IsActive: true },
            ],
          });
          entry.value = "Apple";
          await expectsValidEntry();
        });

        it("sets entry status to invalid with InvalidDropdownValueError for non-existing dropdown item", async () => {
          mockSubscriptionDetail({
            DropdownItems: [
              { Key: 1, Value: "Apple", IsActive: true },
              { Key: 2, Value: "Pear", IsActive: true },
            ],
          });
          entry.value = "Cherry";
          await expectsInvalidEntry(InvalidDropdownValueError);
        });

        it("sets entry status to invalid with InvalidDropdownValueError for inactive dropdown item", async () => {
          mockSubscriptionDetail({
            DropdownItems: [
              { Key: 1, Value: "Apple", IsActive: false },
              { Key: 2, Value: "Pear", IsActive: true },
            ],
          });
          entry.value = "Apple";
          await expectsInvalidEntry(InvalidDropdownValueError);
        });
      });

      async function expectsValidEntry(): Promise<void> {
        const result = await service.fetchAndValidate([entry]);
        expect(result.length).toBe(1);
        expect(result[0].validationError).toBeNull();
        expect(result[0].validationStatus).toBe("valid");
      }

      async function expectsInvalidEntry(
        errorClass: typeof SubscriptionDetailValidationError,
      ): Promise<void> {
        const result = await service.fetchAndValidate([entry]);
        expect(result.length).toBe(1);
        expect(result[0].validationError).toBeInstanceOf(errorClass);
        expect(result[0].validationStatus).toBe("invalid");
      }

      function mockSubscriptionDetail(
        value: Parameters<typeof buildSubscriptionDetailWithValue>[1],
      ): void {
        subscriptionsServiceMock.getSubscriptionDetailsById.and.callFake(
          (subscriptionId) =>
            of([buildSubscriptionDetailWithValue(subscriptionId, value)]),
        );
      }
    });
  });

  function buildEntry({
    eventId = 10,
    personId = 100,
    personEmail = "s1@test.ch",
    subscriptionDetailId = 1100000,
    value = "test",
  }: Partial<SubscriptionDetailEntry>): SubscriptionDetailEntry {
    return { eventId, personId, personEmail, subscriptionDetailId, value };
  }

  function buildSubscriptionDetailWithValue(
    subscriptionId: string | number,
    value: Partial<
      Pick<
        SubscriptionDetail,
        "DropdownItems" | "VssTypeId" | "VssInternet" | "VssStyle" | "Value"
      >
    > = {},
  ): SubscriptionDetail {
    const detailId = Number(subscriptionId) * 1000;
    const detail = buildSubscriptionDetail(detailId);
    detail.Id = `${Number(subscriptionId)}_${detailId}`;
    detail.EventId = 10;
    detail.IdPerson = 100;
    detail.DropdownItems = value.DropdownItems ?? null;
    detail.VssTypeId = value.VssTypeId ?? SubscriptionDetailType.ShortText;
    detail.VssInternet = value.VssInternet ?? "E";
    detail.VssStyle = value.VssStyle ?? "TX";
    detail.Value = value.Value ?? "Lorem ipsum";
    return detail;
  }
});
