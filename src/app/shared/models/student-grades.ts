import { Student } from 'src/app/shared/models/student.model';
import { Result, Test } from 'src/app/shared/models/test.model';
import { Sorting } from '../services/sort.service';
import { average } from '../utils/math';
import { Grading } from './course.model';

export type StudentGrade = {
  student: Student;
  finalGrade: FinalGrade;
  grades: GradeOrNoResult[];
};

export type FinalGrade = {
  id: Maybe<number>;
  average: Maybe<number>;
  finalGradeId: Maybe<number>;
  canGrade: boolean;
};

export type Grade = {
  kind: 'grade';
  result: Result;
  test: Test;
};

export type NoResult = {
  kind: 'no-result';
  test: Test;
};

export type GradeOrNoResult = Grade | NoResult;

export type SortKeys = 'FullName' | Test | 'FinalGrade' | 'TestsMean';

export function transform(
  students: Student[],
  tests: Test[],
  gradings: Grading[]
): StudentGrade[] {
  return students?.map((student) => {
    return {
      student: student,
      finalGrade: getFinalGrade(student, gradings),
      grades: getGrades(student, tests),
    };
  });
}

function getGrades(student: Student, tests: Test[]): GradeOrNoResult[] {
  return tests.map((test) => {
    if (test.Results === undefined || test.Results?.length === 0) {
      return {
        kind: 'no-result',
        test,
      };
    }

    const result: Result | undefined = test.Results?.find(
      (result) => result.StudentId === student.Id
    );

    return result !== undefined
      ? {
          kind: 'grade',
          result: result,
          test: test,
        }
      : {
          kind: 'no-result',
          test,
        };
  });
}

function getFinalGrade(student: Student, gradings: Grading[]): FinalGrade {
  const grading: Maybe<Grading> = gradings.find(
    (grading) => grading.StudentId === student.Id
  );

  return {
    id: grading?.Id,
    average: toAverage(grading),
    finalGradeId: grading?.GradeId,
    canGrade: grading?.CanGrade || false,
  };
}

function toAverage(grading: Grading | undefined) {
  if (grading === undefined) return null;
  if (grading.AverageTestResult === 0) return null;
  return grading!.AverageTestResult;
}

export const compareFn = ({ key, ascending }: Sorting<SortKeys>) => (
  sg1: StudentGrade,
  sg2: StudentGrade
): number => {
  const modificator = ascending ? 1 : -1;

  switch (key) {
    case 'FullName':
      return (
        modificator * sg1.student.FullName.localeCompare(sg2.student.FullName)
      );
    case 'FinalGrade':
      if (!sg1.finalGrade.finalGradeId || !sg2.finalGrade.finalGradeId)
        return modificator * -1;
      return (
        modificator *
        compareNumbers(sg1.finalGrade.finalGradeId, sg2.finalGrade.finalGradeId)
      );
    case 'TestsMean':
      if (!sg1.finalGrade.average || !sg2.finalGrade.average)
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
  sg2: StudentGrade
): number => {
  const grades1: Grade | undefined = sg1.grades
    .filter(isGrade)
    .find((g: Grade) => g.test.Id === test.Id);

  const grades2: Grade | undefined = sg2.grades
    .filter(isGrade)
    .find((g: Grade) => g.test.Id === test.Id);

  if (test.IsPointGrading)
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

function isGrade(g: GradeOrNoResult): g is Grade {
  return g.kind === 'grade';
}

export function toMaxPoints(grade: GradeOrNoResult | null): number {
  return grade?.test.MaxPointsAdjusted || grade?.test.MaxPoints!;
}

export function meanOf(finalGrades: FinalGrade[]): number {
  const averageGrades = finalGrades
    .map((finalGrade) => finalGrade.average)
    .filter(
      (averageGrade) =>
        averageGrade !== null &&
        averageGrade !== undefined &&
        averageGrade !== 0
    )
    .map(Number);
  return average(averageGrades);
}

export function averageOfGradesForScale(
  finalGrades: FinalGrade[],
  scale: { Key: number; Value: string }[]
): number {
  const values = finalGrades
    .map((finalGrade) => finalGrade.finalGradeId)
    .filter((finalGradeId) => finalGradeId !== null)
    .map((finalGradeId) => scale.find((option) => option.Key === finalGradeId))
    .filter((option) => option !== undefined)
    .map((option) => option?.Value)
    .filter((value) => value !== undefined)
    .map(Number)
    .filter((maybeNumber) => !isNaN(maybeNumber));

  return average(values);
}
