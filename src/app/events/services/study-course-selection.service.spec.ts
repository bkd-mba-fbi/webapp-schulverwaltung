import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudyCourseSelectionService } from "./study-course-selection.service";

describe("StudyCourseSelectionService", () => {
  let service: StudyCourseSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [StudyCourseSelectionService],
      }),
    );
    service = TestBed.inject(StudyCourseSelectionService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
