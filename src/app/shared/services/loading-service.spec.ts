import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { LoadingService } from "./loading-service";

describe("LoadingService", () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it("should be created", () => {
    const service: LoadingService = TestBed.inject(LoadingService);
    expect(service).toBeTruthy();
  });
});
