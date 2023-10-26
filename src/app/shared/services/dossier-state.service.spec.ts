import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";

import { DossierStateService } from "./dossier-state.service";

describe("DossierStateService", () => {
  let service: DossierStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [DossierStateService] }),
    );
    service = TestBed.inject(DossierStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
