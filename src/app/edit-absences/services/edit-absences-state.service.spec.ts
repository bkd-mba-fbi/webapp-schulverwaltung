import { TestBed } from "@angular/core/testing";

import { EditAbsencesStateService } from "./edit-absences-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";

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
