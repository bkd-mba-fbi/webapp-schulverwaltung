import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TeachersRestService } from "./teachers-rest.service";

describe("TeachersRestService", () => {
  let service: TeachersRestService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(TeachersRestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
