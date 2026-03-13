import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EventLeadershipRestService } from "./event-leadership-rest.service";

describe("EventLeadershipRestService", () => {
  let service: EventLeadershipRestService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(EventLeadershipRestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
