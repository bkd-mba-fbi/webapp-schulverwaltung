import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { SubscriptionDetailsRestService } from "src/app/shared/services/subscription-details-rest.service";
import { buildEvent, buildSubscriptionDetail } from "src/spec-builders";
import { buildTestModuleMetadata } from "../../../../spec-helpers";
import { ImportError } from "../common/import-state.service";
import { SubscriptionDetailEntry } from "./import-file-subscription-details.service";
import { ImportUploadSubscriptionDetailsService } from "./import-upload-subscription-details.service";
import { SubscriptionDetailImportEntry } from "./import-validate-subscription-details.service";

describe("ImportUploadSubscriptionDetailsService", () => {
  let service: ImportUploadSubscriptionDetailsService;
  let subscriptionDetailsServiceMock: jasmine.SpyObj<SubscriptionDetailsRestService>;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: SubscriptionDetailsRestService,
            useFactory() {
              subscriptionDetailsServiceMock = jasmine.createSpyObj(
                "SubscriptionDetailsRestService",
                ["update"],
              );

              subscriptionDetailsServiceMock.update.and.returnValue(
                of(undefined),
              );

              return subscriptionDetailsServiceMock;
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
          { eventId: 11, subscriptionDetailId: 1001, value: "Lorem ipsum" },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Will fail
          { eventId: 12, subscriptionDetailId: 1002, value: "Dolor sit amet" },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Unchanged value, will not be updated
          { eventId: 11, subscriptionDetailId: 1001, value: "Some value" },
          { validationStatus: "valid", importStatus: null },
        ),
        buildEntry(
          // Invalid entry, should be ignored
          { eventId: 13, subscriptionDetailId: 1003 },
          { validationStatus: "invalid", importStatus: null },
        ),
      ];

      subscriptionDetailsServiceMock.update.and.callFake((detail) =>
        detail.EventId === entries[1].entry.eventId
          ? throwError(() => new Error("500 Internal Server Error"))
          : of(undefined),
      );

      // First attempt (with error)
      const resultEntries = await service.upload(entries);

      expect(subscriptionDetailsServiceMock.update).toHaveBeenCalledTimes(2);

      const updatedValues = subscriptionDetailsServiceMock.update.calls
        .allArgs()
        .map(([_, value]) => value);
      expect(new Set(updatedValues)).toEqual(
        new Set(["Lorem ipsum", "Dolor sit amet"]),
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
      subscriptionDetailsServiceMock.update.and.returnValue(of(undefined));
      subscriptionDetailsServiceMock.update.calls.reset();
      const resultEntries2 = await service.upload(resultEntries, {
        retryFailedOnly: true,
      });

      expect(subscriptionDetailsServiceMock.update).toHaveBeenCalledTimes(1);

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

      expect(subscriptionDetailsServiceMock.update).toHaveBeenCalledTimes(1);

      const value =
        subscriptionDetailsServiceMock.update.calls.mostRecent().args[1];
      expect(value).toBe(10);
    });
  });

  function buildEntry(
    {
      eventId = 10,
      personId = 100,
      personEmail = "s1@test.ch",
      subscriptionDetailId = 1100000,
      value = "Some value",
    }: Partial<SubscriptionDetailEntry>,
    {
      validationStatus = "valid",
      importStatus = null,
    }: Pick<SubscriptionDetailImportEntry, "validationStatus" | "importStatus">,
  ): SubscriptionDetailImportEntry {
    const subscriptionDetail = buildSubscriptionDetail(
      Number(subscriptionDetailId),
    );
    subscriptionDetail.EventId = Number(eventId);
    subscriptionDetail.IdPerson = Number(personId);
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
