import { TestBed } from "@angular/core/testing";
import { TranslateService } from "@ngx-translate/core";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DaysDifferencePipe } from "./days-difference.pipe";

describe("DaysDifferencePipe", () => {
  let pipe: DaysDifferencePipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({}),
    ).compileComponents();
    pipe = new DaysDifferencePipe(TestBed.inject(TranslateService));
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));
  });

  afterEach(() => jasmine.clock().uninstall());

  it("it returns key for today", () => {
    const result = pipe.transform(new Date(2000, 0, 23));
    expect(result).toBe("shared.daysDifference.today");
  });

  it("it returns key for tomorrow", () => {
    const result = pipe.transform(new Date(2000, 0, 24));
    expect(result).toBe("shared.daysDifference.tomorrow");
  });

  it("it returns key for yesterday", () => {
    const result = pipe.transform(new Date(2000, 0, 22));
    expect(result).toBe("shared.daysDifference.yesterday");
  });

  it("it returns key for past date", () => {
    const result = pipe.transform(new Date(2000, 0, 1));
    expect(result).toBe("shared.daysDifference.ago");
  });

  it("it returns key for future date", () => {
    const result = pipe.transform(new Date(2000, 0, 31));
    expect(result).toBe("shared.daysDifference.in");
  });
});
