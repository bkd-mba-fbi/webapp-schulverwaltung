import { Injectable } from '@angular/core';
import { Course } from 'src/app/shared/models/course.model';
import { Student } from 'src/app/shared/models/student.model';
import { Test } from 'src/app/shared/models/test.model';

@Injectable({
  providedIn: 'root',
})
export class StudentGradesService {
  constructor() {}

  transform(course: Course) {
    const students = course.ParticipatingStudents ?? [];
    const tests = course.Tests ?? [];

    const studentsWithGrades = students?.map((student) => {
      return {
        student: student,
        grades: this.getGrades(student, tests),
      };
    });

    return studentsWithGrades;
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
