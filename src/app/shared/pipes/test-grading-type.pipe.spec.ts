import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Test } from 'src/app/shared/models/test.model';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestsGradingTypePipe } from './test-grading-type.pipe';

describe('TestsGradingTypePipe', () => {
  let pipe: TestsGradingTypePipe;
  let test: Test;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({})
      ).compileComponents();
      pipe = new TestsGradingTypePipe(TestBed.inject(TranslateService));
    })
  );

  beforeEach(() => {
    test = buildTest(1, 2, []);
  });

  it('should return the formatted grading type for grades', () => {
    test.IsPointGrading = false;
    test.MaxPoints = null;
    test.MaxPointsAdjusted = null;

    const result = pipe.transform(test);

    expect(result).toBe('tests.type-grades');
  });

  it('should return the formatted grading type for points', () => {
    test.IsPointGrading = true;
    test.MaxPoints = 30;
    test.MaxPointsAdjusted = null;

    const result = pipe.transform(test);

    expect(result).toBe('tests.type-points (30)');
  });

  it('should return the formatted grading type for points adjusted', () => {
    test.IsPointGrading = true;
    test.MaxPoints = 20.5;
    test.MaxPointsAdjusted = 18;

    const result = pipe.transform(test);

    expect(result).toBe('tests.type-points (18, tests.adjusted)');
  });
});
