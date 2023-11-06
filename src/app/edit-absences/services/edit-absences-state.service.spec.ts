import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { EditAbsencesStateService } from "./edit-absences-state.service";

describe("EditAbsencesStateService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [EditAbsencesStateService] }),
    ),
  );

  it("should be created", () => {
    const service: EditAbsencesStateService = TestBed.inject(
      EditAbsencesStateService,
    );
    expect(service).toBeTruthy();
  });
});
