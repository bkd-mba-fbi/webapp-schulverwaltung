import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EditAbsencesUpdateService } from "./edit-absences-update.service";

describe("EditAbsencesUpdateService", () => {
  let service: EditAbsencesUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(EditAbsencesUpdateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
