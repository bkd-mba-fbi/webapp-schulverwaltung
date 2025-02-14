import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ImportParseSubscriptionDetailsService } from "./import-parse-subscription-details.service";

describe("ImportParseSubscriptionDetailsService", () => {
  let service: ImportParseSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [ImportParseSubscriptionDetailsService],
      }),
    );
    service = TestBed.inject(ImportParseSubscriptionDetailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
