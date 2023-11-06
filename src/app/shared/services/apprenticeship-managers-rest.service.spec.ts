import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { ApprenticeshipManagersRestService } from "./apprenticeship-managers-rest.service";

describe("ApprenticeshipManagerRestService", () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it("should be created", () => {
    const service: ApprenticeshipManagersRestService = TestBed.inject(
      ApprenticeshipManagersRestService,
    );
    expect(service).toBeTruthy();
  });
});
