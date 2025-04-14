import { TestBed } from "@angular/core/testing";
import { EvaluationUpdateService } from "./evaluation-update.service";

describe("EvaluationUpdateService", () => {
  let service: EvaluationUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationUpdateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
