import { Result, Test } from 'src/app/shared/models/test.model';

export function replaceResult(result: Result, tests: Test[]): Test[] {
  return tests.map((test) => {
    return test.Id === result.TestId ? replaceResultInTest(result, test) : test;
  });
}

function replaceResultInTest(newResult: Result, test: Test) {
  const newResults = test.Results?.map((oldResult) =>
    newResult.Id === oldResult.Id ? newResult : oldResult
  ) || [newResult];
  return { ...test, Results: newResults };
}
