import { Student } from 'src/app/shared/models/student.model';
import { Result, Test } from 'src/app/shared/models/test.model';
import { Sorting } from '../services/sort.service';

export type StudentGrade = {
  student: Student;
  grades: GradeOrNoResult[];
};

export type Grade = {
  kind: 'grade';
  result: Result;
  test: Test;
};

export type NoResult = {
  kind: 'no-result';
  TestId: number;
};

export type GradeOrNoResult = Grade | NoResult;

export type SortKeys = 'FullName' | Test;

export function transform(students: Student[], tests: Test[]): StudentGrade[] {
  return students?.map((student) => {
    return {
      student: student,
      grades: getGrades(student, tests),
    };
  });
}

function getGrades(student: Student, tests: Test[]): GradeOrNoResult[] {
  return tests.map((test) => {
    if (test.Results === undefined || test.Results?.length === 0) {
      return {
        kind: 'no-result',
        TestId: test.Id,
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
          TestId: test.Id,
        };
  });
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

  // oh boy - typescript is really nice /s
  return (
    (grades2?.result?.GradeValue?.valueOf() ?? 0) -
    (grades1?.result?.GradeValue?.valueOf() ?? 0)
  );
};

function isGrade(g: GradeOrNoResult): g is Grade {
  return g.kind === 'grade';
}
