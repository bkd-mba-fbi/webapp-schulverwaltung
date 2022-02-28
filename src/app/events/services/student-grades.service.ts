import { Injectable } from '@angular/core';
import { rest } from 'lodash-es';
import { Student } from 'src/app/shared/models/student.model';
import { Result, Test } from 'src/app/shared/models/test.model';

export type StudentGrade = {
  student: Student;
  grades: (NoResult | Grade)[];
};

export type Grade = {
  kind: 'grade';
  result: Result;
};

export type NoResult = {
  kind: 'no-result';
  TestId: number;
};

@Injectable({
  providedIn: 'root',
})
export class StudentGradesService {
  constructor() {}

  transform(students: Student[], tests: Test[]): StudentGrade[] {
    return students?.map((student) => {
      return {
        student: student,
        grades: this.getGrades(student, tests),
      };
    });
  }

  private getGrades(student: Student, tests: Test[]): (Grade | NoResult)[] {
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
          }
        : {
            kind: 'no-result',
            TestId: test.Id,
          };
    });
  }
}
