import { Course } from "src/app/shared/models/course.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { average } from "src/app/shared/utils/math";
import { GradingScale } from "../../shared/models/grading-scale.model";

export function findResult(
  course: Option<Course>,
  testId: number,
  studentId: number,
): Option<Result> {
  if (!course) return null;

  return (
    course.Tests?.reduce(
      (result, t) =>
        result ||
        (t.Id === testId &&
          t.Results?.find(
            (r) => r.TestId === testId && r.StudentId === studentId,
          )) ||
        null,
      null as Option<Result>,
    ) ?? null
  );
}

export function replaceResult(
  result: Result,
  tests: Test[],
  ignore?: "grade" | "points",
): Test[] {
  return tests.map((test) =>
    test.Id === result.TestId
      ? replaceResultInTest(result, test, ignore)
      : test,
  );
}

export function deleteResult(
  testId: number,
  studentId: number,
  tests: Test[],
): Test[] {
  return tests.map((test) =>
    test.Id === testId ? deleteResultByStudentId(studentId, test) : test,
  );
}

export function toggleIsPublished(id: number, tests: Test[]) {
  return tests.map((test) =>
    test.Id === id ? { ...test, IsPublished: !test.IsPublished } : test,
  );
}

export function averagePoints(test: Test): number {
  const points: number[] = extractPoints(test);

  if (points.length === 0)
    throw new Error("unable to calculate averages without results");

  return average(points);
}

export function maxPoints(test: Test): number {
  return test.MaxPointsAdjusted || test.MaxPoints!;
}

export function averageGrade(test: Test): number {
  const grades: number[] = extractGrades(test);

  if (grades.length === 0)
    throw new Error("unable to calculate averages without results");

  return average(grades);
}

export function resultOfStudent(studentId: number, test: Test): Maybe<Result> {
  return test.Results?.find((result) => result.StudentId === studentId);
}

export function removeTestById(
  testId: number,
  tests: Test[] | null,
): Test[] | null {
  if (tests === null) return null;
  return tests.filter((test) => test.Id !== testId);
}

export function replaceResultInTest(
  newResult: Result,
  test: Test,
  ignore?: "grade" | "points",
) {
  // Identify result with TestId/StudentId and not via Id, since the initial
  // object added by the optimistic update has no Id yet.
  const currentResult =
    ignore &&
    test.Results?.find(
      (result) =>
        result.TestId === newResult.TestId &&
        result.StudentId === newResult.StudentId,
    );
  const filteredResults =
    test.Results?.filter(
      (result) =>
        !(
          result.TestId === newResult.TestId &&
          result.StudentId === newResult.StudentId
        ),
    ) || [];

  // Ignore the value according to the `ignore` argument, to be able to not
  // overwrite optimistic updates by responses from the server from previous
  // requests
  if (currentResult && ignore === "grade") {
    newResult.GradeId = currentResult.GradeId;
  } else if (currentResult && ignore === "points") {
    newResult.Points = currentResult.Points;
  }

  return { ...test, Results: [...filteredResults, newResult] };
}

export function sortByDate(tests: Test[]) {
  return tests
    .slice()
    .sort((test1, test2) => test2.Date.getTime() - test1.Date.getTime());
}

export function gradingScaleOfTest(
  test: Test,
  gradingScales: GradingScale[],
): Option<GradingScale> {
  return (
    gradingScales?.find(
      (gradingScale) => gradingScale.Id === test.GradingScaleId,
    ) || null
  );
}

function deleteResultByStudentId(studentId: number, test: Test): Test {
  return {
    ...test,
    Results:
      test.Results?.filter((result) => result.StudentId !== studentId) || [],
  };
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
      result.Points !== null ? result.Points : IMPOSSIBLE_POINTS,
    ).filter((point) => point > IMPOSSIBLE_POINTS) || []
  );
}
const IMPOSSIBLE_POINTS: number = -1;
