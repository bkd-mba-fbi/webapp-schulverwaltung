import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { MyProfileService } from "./my-profile.service";

describe("MyProfileService", () => {
  let service: MyProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [MyProfileService],
      }),
    );
    service = TestBed.inject(MyProfileService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
