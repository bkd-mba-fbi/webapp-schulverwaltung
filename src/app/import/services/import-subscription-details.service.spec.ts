import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ImportSubscriptionDetailsService } from "./import-subscription-details.service";

describe("ImportSubscriptionDetailsService", () => {
  let service: ImportSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [ImportSubscriptionDetailsService],
      }),
    );
    service = TestBed.inject(ImportSubscriptionDetailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
