import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StatusProcessesRestService } from "./status-processes-rest.service";

describe("StatusProcessesRestService", () => {
  let service: StatusProcessesRestService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(StatusProcessesRestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
