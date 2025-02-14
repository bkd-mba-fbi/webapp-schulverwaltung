import { TestBed } from "@angular/core/testing";
import { ImportValidateSubscriptionDetailsService } from "./import-validate-subscription-details.service";

describe("ImportValidateSubscriptionDetailsService", () => {
  let service: ImportValidateSubscriptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidateSubscriptionDetailsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
