import { TestBed } from "@angular/core/testing";
import { Test } from "src/app/shared/models/test.model";
import { buildTest } from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { TestsWeightPipe } from "./test-weight.pipe";

describe("TestsWeightPipe", () => {
  let pipe: TestsWeightPipe;
  let test: Test;

  beforeEach(async () => {
    await TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [TestsWeightPipe] }),
    ).compileComponents();
    pipe = TestBed.inject(TestsWeightPipe);
  });

  beforeEach(() => {
    test = buildTest(1, 2, []);
  });

  it("should return the formatted weight", () => {
    test.Weight = 50;
    test.WeightPercent = 12.5;

    const result = pipe.transform(test);

    expect(result).toBe("tests.factor 50 (12.5%)");
  });
});
