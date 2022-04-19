import { Result, Test } from 'src/app/shared/models/test.model';
import { buildResult, buildTest } from 'src/spec-builders';
import { replaceResult } from './tests';

describe('Test utils', () => {
  it('replace a result in a given test', () => {
    // given
    const result = buildResult(1, 1, 55555);

    const test = buildTest(1, 1, [
      result,
      buildResult(2, 1, 55555),
      buildResult(1, 1, 12345),
    ]);

    const newResult = buildResult(1, 1, 55555);
    newResult.Points = 5;

    // when
    const newTests: Test[] = replaceResult(newResult, [test]);

    // then
    expect(newTests.length).toBe(1);
    const newResults: Result[] = newTests[0].Results!;
    expect(newResults.length).toEqual(3);
    expect(newResults).toContain(newResult);
    expect(newResult).not.toContain(result);
  });

  it('add result to test that has no results yet', () => {
    // given
    const test = buildTest(1, 1, null);
    const newResult = buildResult(1, 2, 12345);

    // when
    const newTests = replaceResult(newResult, [test]);

    // then1
    expect(newTests.length).toBe(1);
    const newResults: Result[] = newTests[0].Results!;
    expect(newResults.length).toBe(1);
    expect(newResults).toContain(newResult);
  });

  it('add new result to test that already has results', () => {
    // given
    const test = buildTest(1, 1, [buildResult(1, 1)]);
    const newResult = buildResult(1, 2, 12345);

    // when
    const newTests = replaceResult(newResult, [test]);

    // then1
    expect(newTests.length).toBe(1);
    const newResults: Result[] = newTests[0].Results!;
    expect(newResults.length).toBe(2);
    expect(newResults).toContain(newResult);
  });
});
