import { Result, Test } from 'src/app/shared/models/test.model';

export function replaceResult(result: Result, tests: Test[]): Test[] {
  return tests.map((test) =>
    test.Id === result.TestId ? replaceResultInTest(result, test) : test
  );
}

export function toggleIsPublished(id: number, tests: Test[]) {
  return tests.map((test) =>
    test.Id === id ? { ...test, IsPublished: !test.IsPublished } : test
  );
}

export function averagePoints(test: Test): number {
  const points: number[] = extractPoints(test);

  if (points.length === 0)
    throw new Error('unable to calculate averages without results');

  return average(points, 2);
}

export function averageGrade(test: Test): number {
  const grades: number[] = extractGrades(test);

  if (grades.length === 0)
    throw new Error('unable to calculate averages without results');

  return average(grades, 3);
}

function replaceResultInTest(newResult: Result, test: Test) {
  const filteredResults =
    test.Results?.filter((result) => newResult.Id !== result.Id) || [];
  return { ...test, Results: [...filteredResults, newResult] };
}

function average(values: number[], fractionDigits: number) {
  return Number((sum(values) / values.length).toFixed(fractionDigits));
}

function sum(numbers: number[]) {
  return numbers.reduce(add, 0);
}
function add(a: number, b: number) {
  return a + b;
}

function extractGrades(test: Test) {
  return (
    test.Results?.filter((result) => result.GradeDesignation !== null)
      .map((result) => Number(result.GradeDesignation))
      .filter((grade) => !isNaN(grade)) || []
  );
}

function extractPoints(test: Test) {
  return (
    test.Results?.map((result) =>
      result.Points !== null ? result.Points : IMPOSSIBLE_POINTS
    ).filter((point) => point > IMPOSSIBLE_POINTS) || []
  );
}
const IMPOSSIBLE_POINTS: number = -1;
