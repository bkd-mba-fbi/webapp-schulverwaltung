import { TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateService } from "@ngx-translate/core";
import { Test } from "src/app/shared/models/test.model";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestSummaryShortPipe } from "./test-summary-short.pipe";

describe("TestSummaryShortPipe", () => {
  let test: Test;

  let pipe: TestSummaryShortPipe;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({}),
    ).compileComponents();
    pipe = new TestSummaryShortPipe(TestBed.inject(TranslateService));
  }));

  beforeEach(() => {
    test = buildTest(1234, 4567, []);
    test.Weight = 2;
    test.WeightPercent = 33.33;
  });

  it("should show weight and weightPercent", () => {
    test.IsPointGrading = false;
    test.MaxPoints = null;
    test.MaxPointsAdjusted = null;

    const result = pipe.transform(test);

    expect(result).toBe("2 (33.33%)");
  });

  it("should show point for point gradings", () => {
    test.IsPointGrading = true;
    test.MaxPoints = 30;
    test.MaxPointsAdjusted = null;

    const result = pipe.transform(test);

    expect(result).toBe("2 (33.33%), 30 tests.summary.points");
  });

  it("should return the formatted grading info for points adjusted", () => {
    test.IsPointGrading = true;
    test.MaxPoints = 20.5;
    test.MaxPointsAdjusted = 18;

    const result = pipe.transform(test);

    expect(result).toBe("2 (33.33%), 18 tests.summary.points");
  });
});
