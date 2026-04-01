import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentStateService } from "./student-state.service";

describe("StudentStateService", () => {
  let service: StudentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [StudentStateService] }),
    );
    service = TestBed.inject(StudentStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
