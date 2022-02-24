import { Injectable } from '@angular/core';
import { Student } from 'src/app/shared/models/student.model';
import { Test } from 'src/app/shared/models/test.model';

@Injectable({
  providedIn: 'root',
})
export class StudentGradesService {
  constructor() {}

  transform(students: Student[], tests: Test[]) {
    return students?.map((student) => {
      return {
        student: student,
        grades: this.getGrades(student, tests),
      };
    });
  }

  private getGrades(student: Student, tests: Test[]) {
    return tests.map((test) => {
      if (test.Results === undefined || test.Results?.length === 0) {
        return 'NoResult';
      }

      return (
        test.Results?.find((result) => result.StudentId === student.Id) ??
        'NoResult'
      );
    });
  }
}
