import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ImportFileSubscriptionDetailsService } from "./import-file-subscription-details.service";

describe("ImportFileSubscriptionDetailsService", () => {
  let service: ImportFileSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [ImportFileSubscriptionDetailsService],
      }),
    );
    service = TestBed.inject(ImportFileSubscriptionDetailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
