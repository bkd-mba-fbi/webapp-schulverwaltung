import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StudentAbsencesService } from "./student-absences.service";

describe("StudentAbsencesService", () => {
  let service: StudentAbsencesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [StudentAbsencesService],
      }),
    );
    service = TestBed.inject(StudentAbsencesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
