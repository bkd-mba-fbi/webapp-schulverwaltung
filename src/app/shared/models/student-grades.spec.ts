import { TestBed } from '@angular/core/testing';
import { Course } from 'src/app/shared/models/course.model';
import {
  buildCourse,
  buildResult,
  buildStudent,
  buildTest,
} from 'src/spec-builders';
import { StudentGrade, transform } from './student-grades';

describe('StudentGradesService', () => {
  it('should create a list of students with tests and grades - all grades available for all students', () => {
    // given
    const course: Course = buildCourse(123);
    course.ParticipatingStudents = [100, 200].map((id) => buildStudent(id));
    course.Tests = [1, 2, 3].map((id) =>
      buildTest(
        course.Id,
        id,
        [100, 200].map((studentid) => buildResult(id, studentid))
      )
    );

    // when
    const results: StudentGrade[] = transform(
      course.ParticipatingStudents,
      course.Tests
    );

    // then
    expect(results).toBeDefined();

    expect(results[0].student).toEqual(course.ParticipatingStudents[0]);
    expect(results[1].student).toEqual(course.ParticipatingStudents[1]);
    expect(results[0].grades.length).toBe(3);
    expect(results[1].grades.length).toBe(3);

    expect(
      results[0].grades.some((grade) => grade.kind === 'no-result')
    ).toBeFalsy();
    expect(
      results[1].grades.some((grade) => grade.kind === 'no-result')
    ).toBeFalsy();

    expect(
      results[0].grades.map((grade) =>
        grade.kind !== 'no-result'
          ? [grade.result.TestId, grade.result.StudentId]
          : ''
      )
    ).toEqual([
      [1, 100],
      [2, 100],
      [3, 100],
    ]);
    expect(
      results[1].grades.map((grade) =>
        grade.kind !== 'no-result'
          ? [grade.result.TestId, grade.result.StudentId]
          : ''
      )
    ).toEqual([
      [1, 200],
      [2, 200],
      [3, 200],
    ]);
  });

  it('should create list of students with grades, NoResults yet', () => {
    // given
    const course: Course = buildCourse(123);
    course.ParticipatingStudents = [100, 200].map((id) => buildStudent(id));
    course.Tests = [1, 2, 3].map((id) => buildTest(course.Id, id, []));

    // when
    const results = transform(course.ParticipatingStudents, course.Tests);

    // then
    expect(
      results[0].grades.every((grade) => grade.kind === 'no-result')
    ).toBeTruthy();
    expect(
      results[1].grades.every((grade) => grade.kind === 'no-result')
    ).toBeTruthy();
  });

  it('should create list of students with grades with results only for one student', () => {
    // given
    const course: Course = buildCourse(123);
    course.ParticipatingStudents = [100, 200].map((id) => buildStudent(id));
    course.Tests = [1, 2, 3].map((id) =>
      buildTest(
        course.Id,
        id,
        [100].map((studentid) => buildResult(id, studentid))
      )
    );

    // when
    const results = transform(course.ParticipatingStudents, course.Tests);
    // then

    expect(
      results[0].grades.map((grade) =>
        grade.kind !== 'no-result'
          ? [grade.result.TestId, grade.result.StudentId]
          : 'no-result'
      )
    ).toEqual([
      [1, 100],
      [2, 100],
      [3, 100],
    ]);
    expect(
      results[1].grades.map((grade) =>
        grade.kind !== 'no-result'
          ? [grade.result.TestId, grade.result.StudentId]
          : 'no-result'
      )
    ).toEqual([`no-result`, `no-result`, `no-result`]);
  });

  it('should fill up holes with missing grades as no-result', () => {
    // given
    const course = buildCourse(123);
    course.ParticipatingStudents = [buildStudent(99)];
    course.Tests = [1, 2, 3].map((id) =>
      buildTest(course.Id, id, id % 2 === 0 ? [buildResult(id, 99)] : [])
    );
    // when
    const results = transform(course.ParticipatingStudents, course.Tests);

    // then

    expect(results[0].student).toEqual(course.ParticipatingStudents[0]);
    expect(results[0].grades.length).toBe(3);
    expect(
      results[0].grades.map((grade) =>
        grade.kind !== 'no-result'
          ? [grade.result.TestId, grade.result.StudentId]
          : 'no-result'
      )
    ).toEqual(['no-result', [2, 99], 'no-result']);
  });
});