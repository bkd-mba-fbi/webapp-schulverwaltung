import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { PresenceTypesRestService } from "./presence-types-rest.service";

describe("PresenceTypesRestService", () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it("should be created", () => {
    const service: PresenceTypesRestService = TestBed.inject(
      PresenceTypesRestService,
    );
    expect(service).toBeTruthy();
  });
});
