import { Result, Test } from 'src/app/shared/models/test.model';

export function replaceResult(result: Result, tests: Test[]): Test[] {
  return tests.map((test) => {
    return test.Id === result.TestId ? replaceResultInTest(result, test) : test;
  });
}

function replaceResultInTest(newResult: Result, test: Test) {
  const filteredResults =
    test.Results?.filter((result) => newResult.Id !== result.Id) || [];
  return { ...test, Results: [...filteredResults, newResult] };
}
