import { TestBed } from "@angular/core/testing";
import { buildTestModuleMetadata } from "../../../spec-helpers";
import { I18nService } from "../services/i18n.service";
import { AddSpacePipe } from "./add-space.pipe";

describe("AddSpacePipe", () => {
  beforeEach(() => {
    const i18nService = {
      detectLanguage: () => "fr-CH",
    };

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          AddSpacePipe,
          { provide: I18nService, useValue: i18nService },
        ],
      }),
    );
  });

  it("create an instance", () => {
    const pipe = TestBed.inject(AddSpacePipe);
    expect(pipe).toBeTruthy();
  });

  it("return space before colon for french", () => {
    const pipe = TestBed.inject(AddSpacePipe).transform("Test:", ":");
    expect(pipe).toBe("Test :");
  });

  it("return space before question mark for french", () => {
    const pipe = TestBed.inject(AddSpacePipe).transform("Test?", "?");
    expect(pipe).toBe("Test ?");
  });

  it("return space before colon and question mark for french", () => {
    const pipe = TestBed.inject(AddSpacePipe).transform("Test: Test?", ":?");
    expect(pipe).toBe("Test : Test ?");
  });
});
