import { TestBed } from "@angular/core/testing";
import { ImportStateService } from "./import-state.service";

describe("ImportStateService", () => {
  let service: ImportStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportStateService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
