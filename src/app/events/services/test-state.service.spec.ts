import { TestBed } from "@angular/core/testing";

import { TestStateService } from "./test-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";

describe("TestStateService", () => {
  let service: TestStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [TestStateService] }),
    );
    service = TestBed.inject(TestStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
