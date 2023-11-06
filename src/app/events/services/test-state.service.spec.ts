import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestStateService } from "./test-state.service";

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
