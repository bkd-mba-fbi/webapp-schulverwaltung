import { Student } from "src/app/shared/models/student.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { Sorting } from "../services/sort.service";
import { average } from "../utils/math";
import { FinalGrading, Grading } from "./course.model";
import { DropDownItem } from "./drop-down-item.model";

export type StudentGrade = {
  student: Student;
  finalGrade: Option<FinalGrade>;
  grades: GradeOrNoResult[];
};

export type FinalGrade = {
  id: number;
  average: Option<number>;
  finalGradeId: Option<number>;
  freeHandGrade: Option<number>;
  canGrade: boolean;
};

export type GradeKind = {
  kind: "grade";
  result: Result;
  test: Test;
};

export type NoResult = {
  kind: "no-result";
  test: Test;
};

export type GradeOrNoResult = GradeKind | NoResult;

export type SortKeys = "FullName" | Test | "FinalGrade" | "TestsMean";

export function pluckFinalGrades(
  studentGrades: ReadonlyArray<StudentGrade>,
): ReadonlyArray<FinalGrade> {
  return studentGrades.map(({ finalGrade }) => finalGrade).filter(isFinalGrade);
}

function isFinalGrade(
  finalGrade: Option<FinalGrade>,
): finalGrade is FinalGrade {
  return finalGrade !== null;
}

export function transform(
  students: ReadonlyArray<Student>,
  tests: ReadonlyArray<Test>,
  gradings: ReadonlyArray<Grading>,
  finalGrades: ReadonlyArray<FinalGrading>,
): StudentGrade[] {
  return students?.map((student) => {
    return {
      student: student,
      finalGrade: getFinalGrade(student, gradings, finalGrades),
      grades: getGrades(student, tests),
    };
  });
}

function getGrades(
  student: Student,
  tests: ReadonlyArray<Test>,
): GradeOrNoResult[] {
  return tests.map((test) => {
    if (test.Results === undefined || test.Results?.length === 0) {
      return {
        kind: "no-result",
        test,
      };
    }

    const result: Result | undefined = test.Results?.find(
      (result) => result.StudentId === student.Id,
    );

    return result !== undefined
      ? {
          kind: "grade",
          result: result,
          test: test,
        }
      : {
          kind: "no-result",
          test,
        };
  });
}

function getFinalGrade(
  student: Student,
  gradings: ReadonlyArray<Grading>,
  finalGrades: ReadonlyArray<FinalGrading>,
): Option<FinalGrade> {
  const grading: Maybe<Grading> = gradings.find(
    (grading) => grading.StudentId === student.Id,
  );

  const finalGrading: Maybe<FinalGrading> = finalGrades.find(
    (grading) => grading.StudentId === student.Id,
  );

  if (!grading) return null;

  return {
    id: grading.Id,
    average: toAverage(grading),
    finalGradeId: grading.GradeId,
    freeHandGrade: finalGrading ? Number(finalGrading.Grade) : null,
    canGrade: grading.CanGrade,
  };
}

function toAverage(grading: Grading) {
  if (grading.AverageTestResult === 0) return null;
  return grading.AverageTestResult;
}

export const compareFn =
  ({ key, ascending }: Sorting<SortKeys>) =>
  (sg1: StudentGrade, sg2: StudentGrade): number => {
    const modificator = ascending ? 1 : -1;

    switch (key) {
      case "FullName":
        return (
          modificator * sg1.student.FullName.localeCompare(sg2.student.FullName)
        );
      case "FinalGrade":
        if (!sg1.finalGrade?.finalGradeId || !sg2.finalGrade?.finalGradeId)
          return modificator * -1;
        return (
          modificator *
          compareNumbers(
            sg1.finalGrade.finalGradeId,
            sg2.finalGrade.finalGradeId,
          )
        );
      case "TestsMean":
        if (!sg1.finalGrade?.average || !sg2.finalGrade?.average)
          return modificator * -1;
        return (
          modificator *
          compareNumbers(sg1.finalGrade.average, sg2.finalGrade.average)
        );
    }

    return modificator * compareGrades(key, sg1, sg2);
  };

const compareGrades = (
  test: Test,
  sg1: StudentGrade,
  sg2: StudentGrade,
): number => {
  const grades1: GradeKind | undefined = sg1.grades
    .filter(isGrade)
    .find((g: GradeKind) => g.test.Id === test.Id);

  const grades2: GradeKind | undefined = sg2.grades
    .filter(isGrade)
    .find((g: GradeKind) => g.test.Id === test.Id);

  if (
    test.IsPointGrading &&
    grades1?.result.GradeId === grades2?.result.GradeId
  )
    return (grades1?.result.Points ?? 0) - (grades2?.result.Points ?? 0);

  return (
    ((grades1?.result.GradeId ?? Number.POSITIVE_INFINITY) -
      (grades2?.result.GradeId ?? Number.POSITIVE_INFINITY)) *
    -1
  );
};

function compareNumbers(nr1: number, nr2: number) {
  if (nr1 === nr2) return 0;
  if (nr1 < nr2) return -1;
  return 1;
}

function isGrade(g: GradeOrNoResult): g is GradeKind {
  return g.kind === "grade";
}

export function toMaxPoints(grade: GradeOrNoResult | null): number {
  return (grade?.test?.MaxPointsAdjusted || grade?.test?.MaxPoints) ?? 0;
}

export function meanOf(finalGrades: ReadonlyArray<FinalGrade>): number {
  const averageGrades = finalGrades
    .map((finalGrade) => finalGrade.average)
    .filter(
      (averageGrade) =>
        averageGrade !== null &&
        averageGrade !== undefined &&
        averageGrade !== 0,
    )
    .map(Number);
  return average(averageGrades);
}

export function averageOfGradesForScale(
  finalGrades: ReadonlyArray<FinalGrade>,
  scale: ReadonlyArray<DropDownItem>,
): number {
  const freeHandGrades: number[] = finalGrades
    .map((finalGrade) => finalGrade.freeHandGrade)
    .filter((finalGrade): finalGrade is number => !!finalGrade);

  const grades: number[] = finalGrades
    .map((finalGrade) => finalGrade.finalGradeId)
    .filter((finalGradeId) => finalGradeId !== null)
    .map((finalGradeId) => scale.find((option) => option.Key === finalGradeId))
    .filter((option) => option !== undefined)
    .map((option) => option?.Value)
    .filter((value) => value !== undefined)
    .map(Number)
    .filter((maybeNumber) => !isNaN(maybeNumber));

  return average([...grades, ...freeHandGrades]);
}
