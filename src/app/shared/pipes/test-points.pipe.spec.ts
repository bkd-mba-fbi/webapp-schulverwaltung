import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Test } from 'src/app/shared/models/test.model';
import { buildResult, buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestPointsPipe } from './test-points.pipe';

describe('TestsPointsPipe', () => {
  let pipe: TestPointsPipe;
  let test: Test;
  const testId = 2;
  const studentId = 3;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule(
        buildTestModuleMetadata({})
      ).compileComponents();
      pipe = new TestPointsPipe(TestBed.inject(TranslateService));
    })
  );

  beforeEach(() => {
    test = buildTest(1, testId, []);
  });

  it('should show empty string if is not point grading', () => {
    test.IsPointGrading = false;

    expect(pipe.transform(test, studentId)).toBe('');
  });

  it('should show "- / maxPoints" if student has no result', () => {
    test.IsPointGrading = true;
    test.MaxPoints = 27;
    test.MaxPointsAdjusted = null;

    expect(pipe.transform(test, studentId)).toBe('- / 27 tests.points');
  });

  it('should show "- / maxPointsAdjusted" if student has no result and test points are adjusted', () => {
    test.IsPointGrading = true;
    test.MaxPoints = 27;
    test.MaxPointsAdjusted = 30;

    expect(pipe.transform(test, studentId)).toBe('- / 30 tests.points');
  });

  it('should show "actual points / maxPoints" for student with a result', () => {
    test.IsPointGrading = true;
    test.MaxPoints = 27;
    test.MaxPointsAdjusted = null;
    const result = buildResult(testId, studentId);
    result.Points = 26;
    test.Results = [result];

    expect(pipe.transform(test, studentId)).toBe('26 / 27 tests.points');
  });
});
