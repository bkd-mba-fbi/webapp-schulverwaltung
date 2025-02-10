import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { SafePipe } from "./safe.pipe";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("SafePipe", () => {
  let sanitizer: any;

  beforeEach(() => {
    sanitizer = {};
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [SafePipe, { provide: "DomSanitizer", useValue: sanitizer }],
      }),
    );
  });

  it("create an instance", () => {
    const pipe = TestBed.inject(SafePipe);
    expect(pipe).toBeTruthy();
  });
});
