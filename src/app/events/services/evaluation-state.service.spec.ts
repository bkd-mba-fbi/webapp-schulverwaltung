import { TestBed } from "@angular/core/testing";
import { EvaluationStateService } from "./evaluation-state.service";

describe("EvaluationStateService", () => {
  let service: EvaluationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
