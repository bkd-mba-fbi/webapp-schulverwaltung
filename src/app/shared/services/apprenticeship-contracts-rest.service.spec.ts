import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { ApprenticeshipContractsRestService } from "./apprenticeship-contracts-rest.service";

describe("ApprenticeshipContractsRestService", () => {
  let service: ApprenticeshipContractsRestService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(ApprenticeshipContractsRestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
