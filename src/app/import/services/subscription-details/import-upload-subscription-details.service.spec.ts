import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import { buildEvent, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportError } from "../common/import-state.service";
import { SubscriptionDetailEntry } from "./import-file-subscription-details.service";
import { ImportUploadSubscriptionDetailsService } from "./import-upload-subscription-details.service";
import { SubscriptionDetailImportEntry } from "./import-validate-subscription-details.service";

describe("ImportUploadSubscriptionDetailsService", () => {
  let service: ImportUploadSubscriptionDetailsService;
  let subscriptionsServiceMock: jasmine.SpyObj<SubscriptionsRestService>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: SubscriptionsRestService,
            useFactory() {
              subscriptionsServiceMock = jasmine.createSpyObj(
                "SubscriptionsRestService",
                ["updateSubscriptionDetails"],
              );

              subscriptionsServiceMock.updateSubscriptionDetails.and.returnValue(
                of(undefined),
              );

              return subscriptionsServiceMock;
            },
          },
        ],
      }),
    );
    service = TestBed.inject(ImportUploadSubscriptionDetailsService);
  });

  describe("upload", () => {
    it("updates subscription details, marks them as success/error & updates progress, then retries", async () => {
      const entries: ReadonlyArray<SubscriptionDetailImportEntry> = [
        buildEntry(
          // Will succeed
          {
            eventId: 11,
            subscriptionId: 111,
            subscriptionDetailId: 1111,
            value: "Lorem ipsum",
          },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Will also succeed
          {
            eventId: 11,
            subscriptionId: 111,
            subscriptionDetailId: 1112,
            value: "Dolor sit amet",
          },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Unchanged value, will not be updated
          {
            eventId: 11,
            subscriptionId: 111,
            subscriptionDetailId: 1113,
            value: "Some value",
          },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Will succeed
          {
            eventId: 11,
            subscriptionId: 112,
            subscriptionDetailId: 1121,
            value: "Another value for same event but different subscription",
          },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Will succeed
          {
            eventId: 12,
            subscriptionId: 121,
            subscriptionDetailId: 1211,
            value: "Another value for different event",
          },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Invalid entry, should be ignored
          { eventId: 13, subscriptionId: 103, subscriptionDetailId: 1003 },
          { validationStatus: "invalid", importStatus: null },
        ),
        buildEntry(
          // Will fail
          {
            eventId: 14,
            subscriptionId: 141,
            subscriptionDetailId: 1411,
            value: "Foo",
          },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Will fail
          {
            eventId: 14,
            subscriptionId: 141,
            subscriptionDetailId: 1412,
            value: "Bar",
          },
          { validationStatus: "valid", importStatus: null },
        ),
      ];

      subscriptionsServiceMock.updateSubscriptionDetails.and.callFake(
        (subscriptionId) =>
          Number(subscriptionId) === 141
            ? throwError(() => new Error("500 Internal Server Error"))
            : of(undefined),
      );

      // First attempt (with error)
      const resultEntries = await service.upload(entries);

      expect(
        subscriptionsServiceMock.updateSubscriptionDetails,
      ).toHaveBeenCalledTimes(4);

      const updatedValues =
        subscriptionsServiceMock.updateSubscriptionDetails.calls
          .allArgs()
          .flatMap(([_, details]) => details.map((detail) => detail.Value));
      expect(new Set(updatedValues)).toEqual(
        new Set([
          "Lorem ipsum",
          "Dolor sit amet",
          "Another value for same event but different subscription",
          "Another value for different event",
          "Foo",
          "Bar",
        ]),
      );

      expect(resultEntries.length).toBe(8);
      expect(resultEntries[0].importStatus).toBe("success");
      expect(resultEntries[0].importError).toBeNull();
      expect(resultEntries[1].importStatus).toBe("success");
      expect(resultEntries[1].importError).toBeNull();
      expect(resultEntries[2].importStatus).toBe("success");
      expect(resultEntries[2].importError).toBeNull();
      expect(resultEntries[3].importStatus).toBe("success");
      expect(resultEntries[3].importError).toBeNull();
      expect(resultEntries[4].importStatus).toBe("success");
      expect(resultEntries[4].importError).toBeNull();
      expect(resultEntries[5].importStatus).toBeNull();
      expect(resultEntries[5].importError).toBeNull();
      expect(resultEntries[6].importStatus).toBe("error");
      expect(resultEntries[6].importError).toBeInstanceOf(ImportError);
      expect(resultEntries[7].importStatus).toBe("error");
      expect(resultEntries[7].importError).toBeInstanceOf(ImportError);

      expect(service.progress()).toEqual({
        uploading: 0,
        success: 5,
        error: 2,
        total: 7,
      });

      // Retry (this time without error)
      subscriptionsServiceMock.updateSubscriptionDetails.and.returnValue(
        of(undefined),
      );
      subscriptionsServiceMock.updateSubscriptionDetails.calls.reset();
      const resultEntries2 = await service.upload(resultEntries, {
        retryFailedOnly: true,
      });

      expect(
        subscriptionsServiceMock.updateSubscriptionDetails,
      ).toHaveBeenCalledTimes(1);

      expect(resultEntries2.length).toBe(8);
      expect(resultEntries2[0].importStatus).toBe("success");
      expect(resultEntries2[0].importError).toBeNull();
      expect(resultEntries2[1].importStatus).toBe("success");
      expect(resultEntries2[1].importError).toBeNull();
      expect(resultEntries2[2].importStatus).toBe("success");
      expect(resultEntries2[2].importError).toBeNull();
      expect(resultEntries2[3].importStatus).toBe("success");
      expect(resultEntries2[3].importError).toBeNull();
      expect(resultEntries2[4].importStatus).toBe("success");
      expect(resultEntries2[4].importError).toBeNull();
      expect(resultEntries2[5].importStatus).toBeNull();
      expect(resultEntries2[5].importError).toBeNull();
      expect(resultEntries2[6].importStatus).toBe("success");
      expect(resultEntries2[6].importError).toBeNull();
      expect(resultEntries2[7].importStatus).toBe("success");
      expect(resultEntries2[7].importError).toBeNull();

      expect(service.progress()).toEqual({
        uploading: 0,
        success: 7,
        error: 0,
        total: 7,
      });
    });

    it("sends `Key` of corresponding dropdown item as value", async () => {
      const entry = buildEntry(
        { eventId: 11, subscriptionDetailId: 1001, value: "Apple" },
        { validationStatus: "valid", importStatus: null },
      );
      entry.data.subscriptionDetail!.DropdownItems = [
        { Key: 10, Value: "Apple", IsActive: true },
        { Key: 11, Value: "Pear", IsActive: true },
      ];

      await service.upload([entry]);

      expect(
        subscriptionsServiceMock.updateSubscriptionDetails,
      ).toHaveBeenCalledTimes(1);

      const value =
        subscriptionsServiceMock.updateSubscriptionDetails.calls.allArgs()[0][1][0]
          .Value;
      expect(value).toBe(10);
    });
  });

  function buildEntry(
    {
      eventId = 10,
      personId = 100,
      personEmail = "s1@test.ch",
      subscriptionId = 110000,
      subscriptionDetailId = 1100000,
      value = "Some value",
    }: Partial<SubscriptionDetailEntry & { subscriptionId: number }>,
    {
      validationStatus = "valid",
      importStatus = null,
    }: Pick<SubscriptionDetailImportEntry, "validationStatus" | "importStatus">,
  ): SubscriptionDetailImportEntry {
    const subscriptionDetail = buildSubscriptionDetail(
      Number(subscriptionDetailId) * 10,
    );
    subscriptionDetail.EventId = Number(eventId);
    subscriptionDetail.IdPerson = Number(personId);
    subscriptionDetail.SubscriptionId = subscriptionId;
    subscriptionDetail.Value = "Some value";
    return {
      entry: { eventId, personId, personEmail, subscriptionDetailId, value },
      data: {
        event: buildEvent(Number(eventId)),
        person: { Id: Number(personId), FullName: "Mr. Tux" },
        subscriptionDetail,
      },
      validationStatus,
      validationError: null,
      importStatus,
      importError: null,
    };
  }
});
