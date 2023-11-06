import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EvaluateAbsencesStateService } from "./evaluate-absences-state.service";

describe("EvaluateAbsencesStateService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [EvaluateAbsencesStateService] }),
    ),
  );

  it("should be created", () => {
    const service: EvaluateAbsencesStateService = TestBed.inject(
      EvaluateAbsencesStateService,
    );
    expect(service).toBeTruthy();
  });
});
