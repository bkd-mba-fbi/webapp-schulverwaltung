import { TestBed } from "@angular/core/testing";
import { EvaluationSubscriptionDetailUpdateService } from "./evaluation-subscription-detail-update.service";

describe("EvaluationSubscriptionDetailUpdateService", () => {
  let service: EvaluationSubscriptionDetailUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationSubscriptionDetailUpdateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
