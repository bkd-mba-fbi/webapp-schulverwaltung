import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ImportSubscriptionDetailsStateService } from "./import-subscription-details-state.service";

describe("ImportSubscriptionDetailsStateService", () => {
  let service: ImportSubscriptionDetailsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [ImportSubscriptionDetailsStateService],
      }),
    );
    service = TestBed.inject(ImportSubscriptionDetailsStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
