import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { Test } from 'src/app/shared/models/test.model';
import { buildTest } from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { TestsWeightPipe } from './test-weight.pipe';

describe('TestsWeightPipe', () => {
  let pipe: TestsWeightPipe;
  let test: Test;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({})
    ).compileComponents();
    pipe = new TestsWeightPipe(TestBed.inject(TranslateService));
  }));

  beforeEach(() => {
    test = buildTest(1, 2, []);
  });

  it('should return the formatted weight', () => {
    test.Weight = 50;
    test.WeightPercent = 12.5;

    const result = pipe.transform(test);

    expect(result).toBe('tests.factor 50 (12.5%)');
  });
});
