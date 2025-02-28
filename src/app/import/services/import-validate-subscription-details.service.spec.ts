import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { SubscriptionDetailType } from "src/app/shared/models/subscription.model";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import {
  buildEvent,
  buildPersonSummary,
  buildSubscriptionDetail,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import {
  InvalidEventIdError,
  InvalidPersonEmailError,
  InvalidPersonIdError,
  InvalidSubscriptionDetailIdError,
  MissingPersonIdEmailError,
  MissingValueError,
  SubscriptionDetailValidationError,
} from "../utils/subscription-details/error";
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
                      summary.Email = email;
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
                (subscriptionId) => {
                  const detailId = Number(subscriptionId) * 1000;
                  const detail = buildSubscriptionDetail(detailId);
                  detail.Id = `${Number(subscriptionId)}_${detailId}`;
                  detail.DropdownItems = null;
                  detail.VssTypeId = SubscriptionDetailType.Text;
                  detail.VssInternet = "E";
                  detail.VssStyle = "TX";
                  detail.Value = "Lorem ipsum";
                  return of([detail]);
                },
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
    subscriptionDetailId = 1100000,
    value = "test",
  }: Partial<SubscriptionDetailEntry>): SubscriptionDetailEntry {
    return { eventId, personId, personEmail, subscriptionDetailId, value };
  }
});
