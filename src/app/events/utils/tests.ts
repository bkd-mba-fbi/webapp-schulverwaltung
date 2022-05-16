import { Result, Test } from 'src/app/shared/models/test.model';
import { average } from 'src/app/shared/utils/math';

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

  return average(points);
}

export function averageGrade(test: Test): number {
  const grades: number[] = extractGrades(test);

  if (grades.length === 0)
    throw new Error('unable to calculate averages without results');

  return average(grades);
}

export function resultOfStudent(studentId: number, test: Test): Maybe<Result> {
  return test.Results?.find((result) => result.StudentId === studentId);
}

export function removeTestById(
  testId: number,
  tests: Test[] | null
): Test[] | null {
  if (tests === null) return null;
  return tests.filter((test) => test.Id !== testId);
}

function replaceResultInTest(newResult: Result, test: Test) {
  const filteredResults =
    test.Results?.filter((result) => newResult.Id !== result.Id) || [];
  return { ...test, Results: [...filteredResults, newResult] };
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
