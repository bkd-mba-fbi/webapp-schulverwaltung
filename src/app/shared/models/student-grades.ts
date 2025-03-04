import { Student } from "src/app/shared/models/student.model";
import { Result, Test } from "src/app/shared/models/test.model";
import { SortCriteria } from "../components/sortable-header/sortable-header.component";
import { nonZero } from "../utils/filter";
import { average } from "../utils/math";
import { FinalGrading, Grading } from "./course.model";
import { DropDownItem } from "./drop-down-item.model";

export type StudentGrade = {
  student: Student;
  finalGrade: FinalGrade;
  grades: GradeOrNoResult[];
};

export type FinalGrade = {
  gradingId?: number;
  average?: number;
  gradeId?: number;
  finalGradeValue?: string;
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

export type StudentGradesSortKey =
  | "FullName"
  | "Test-${number}"
  | "FinalGrade"
  | "TestsMean";

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
): FinalGrade {
  const grading = gradings.find((grading) => grading.StudentId === student.Id);
  if (grading) {
    return {
      gradingId: grading.Id,
      gradeId: grading.GradeId ?? undefined,
      average: grading.AverageTestResult || undefined, // 0 is mapped to undefined
      canGrade: grading.CanGrade,
    };
  }

  const finalGrade = finalGrades.find(
    (grading) => grading.StudentId === student.Id,
  );
  if (finalGrade) {
    return {
      finalGradeValue: finalGrade.Grade,
      average: finalGrade.AverageTestResult || undefined, // 0 is mapped to undefined
      canGrade: false,
    };
  }

  throw new Error(
    `Student ${student.FullName} has neither a grading and nor a final grade, this should not happen`,
  );
}

export const compareFn = (
  { primarySortKey, ascending }: SortCriteria<StudentGradesSortKey>,
  tests: ReadonlyArray<Test>,
) => {
  const modifier = ascending ? 1 : -1;
  let test: Option<Test> = null;
  if (primarySortKey.startsWith("Test-")) {
    const testId = Number(primarySortKey.replace("Test-", ""));
    test = tests.find((t) => t.Id === testId) ?? null;
  }

  return (sg1: StudentGrade, sg2: StudentGrade): number => {
    switch (primarySortKey) {
      case "FullName":
        return (
          modifier * sg1.student.FullName.localeCompare(sg2.student.FullName)
        );
      case "FinalGrade":
        if (!sg1.finalGrade?.gradeId || !sg2.finalGrade?.gradeId)
          return modifier * -1;
        return (
          modifier *
          compareNumbers(sg1.finalGrade.gradeId, sg2.finalGrade.gradeId)
        );
      case "TestsMean":
        if (!sg1.finalGrade?.average || !sg2.finalGrade?.average)
          return modifier * -1;
        return (
          modifier *
          compareNumbers(sg1.finalGrade.average, sg2.finalGrade.average)
        );
      default:
        if (primarySortKey.startsWith("Test-") && test) {
          return modifier * compareGrades(test, sg1, sg2);
        }
        return 0;
    }
  };
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
  return average(
    finalGrades
      .map((finalGrade) => getFinalGradeValue(finalGrade, scale))
      .filter(nonZero),
  );
}

function getFinalGradeValue(
  { gradeId: finalGradeId, finalGradeValue }: FinalGrade,
  scale: ReadonlyArray<DropDownItem>,
): number {
  let value: string | undefined;
  if (finalGradeId) {
    const scaleEntry = scale.find((e) => e.Key === finalGradeId);
    value = scaleEntry?.Value;
  } else {
    value = finalGradeValue;
  }

  const numberValue = Number(value);
  return isNaN(numberValue) ? 0 : numberValue;
}
