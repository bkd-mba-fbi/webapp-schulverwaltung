import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudyCourseStatusService } from "./study-course-status.service";

describe("StudyCourseStatusService", () => {
  let service: StudyCourseStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(StudyCourseStatusService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
