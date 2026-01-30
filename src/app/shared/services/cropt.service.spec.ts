import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { CroptService } from "./cropt.service";

describe("CroptService", () => {
  let service: CroptService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [CroptService],
      }),
    );
    service = TestBed.inject(CroptService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
