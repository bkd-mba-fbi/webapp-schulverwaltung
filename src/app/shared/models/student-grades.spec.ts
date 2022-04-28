import { GradingScaleOptions } from 'src/app/events/services/test-edit-grades-state.service';
import { Course } from 'src/app/shared/models/course.model';
import {
  buildCourse,
  buildGrading,
  buildResult,
  buildStudent,
  buildTest,
} from 'src/spec-builders';
import { GradingScale } from './grading-scale.model';
import {
  FinalGrade,
  Grade,
  meanOf,
  meanOfGradesFromScale,
  NoResult,
  StudentGrade,
  toMaxPoints,
  transform,
} from './student-grades';

describe('student-grade utils', () => {
  describe('student grades with results and final grades', () => {
    let studentGrades: StudentGrade[];
    const course = buildCourse(123);
    beforeEach(() => {
      course.ParticipatingStudents = [100, 200].map((id) => buildStudent(id));
      course.Tests = [1, 2, 3].map((id) =>
        buildTest(
          course.Id,
          id,
          [100, 200].map((studentid) => buildResult(id, studentid))
        )
      );
      course.Gradings = course.ParticipatingStudents.map(
        (student) => student.Id
      ).map((studentId, index) => buildGrading(studentId, 5.75 - index));

      // when
      studentGrades = transform(
        course.ParticipatingStudents,
        course.Tests,
        course.Gradings
      );
    });
    it('should create a list of students with tests and grades - all grades available for all students', () => {
      // given

      // then
      expect(studentGrades).toBeDefined();

      expect(studentGrades[0].student).toEqual(
        course.ParticipatingStudents![0]
      );
      expect(studentGrades[1].student).toEqual(
        course.ParticipatingStudents![1]
      );
      expect(studentGrades[0].finalGrade.average).toBe(5.75);
      expect(studentGrades[1].finalGrade.average).toBe(4.75);
      expect(studentGrades[0].finalGrade.finalGradeId).toBe(3);
      expect(studentGrades[1].finalGrade.finalGradeId).toBe(3);
      expect(studentGrades[0].grades.length).toBe(3);
      expect(studentGrades[1].grades.length).toBe(3);

      expect(
        studentGrades[0].grades.some((grade) => grade.kind === 'no-result')
      ).toBeFalsy();
      expect(
        studentGrades[1].grades.some((grade) => grade.kind === 'no-result')
      ).toBeFalsy();

      expect(
        studentGrades[0].grades.map((grade) =>
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
        studentGrades[1].grades.map((grade) =>
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
  });

  it('should create list of students with grades, NoResults yet', () => {
    // given
    const course: Course = buildCourse(123);
    course.ParticipatingStudents = [100, 200].map((id) => buildStudent(id));
    course.Tests = [1, 2, 3].map((id) => buildTest(course.Id, id, []));
    course.Gradings = [];

    // when
    const results = transform(
      course.ParticipatingStudents,
      course.Tests,
      course.Gradings
    );

    // then
    expect(
      results[0].grades.every((grade) => grade.kind === 'no-result')
    ).toBeTruthy();
    expect(
      results[1].grades.every((grade) => grade.kind === 'no-result')
    ).toBeTruthy();

    expect(results[0].finalGrade).toBeUndefined;
    expect(results[1].finalGrade).toBeUndefined;
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
    course.Gradings = [buildGrading(100)];

    // when
    const results = transform(
      course.ParticipatingStudents,
      course.Tests,
      course.Gradings
    );
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

    expect(results[0].finalGrade.average).toBe(2.275);
    expect(results[1].finalGrade.average).toBeUndefined;
    expect(results[0].finalGrade.finalGradeId).toBe(3);
    expect(results[1].finalGrade.finalGradeId).toBeUndefined;
    expect(results[0].finalGrade.canGrade).toBe(false);
    expect(results[1].finalGrade.canGrade).toBe(false);
  });

  it('should fill up holes with missing grades as no-result', () => {
    // given
    const course = buildCourse(123);
    course.ParticipatingStudents = [buildStudent(99)];
    course.Tests = [1, 2, 3].map((id) =>
      buildTest(course.Id, id, id % 2 === 0 ? [buildResult(id, 99)] : [])
    );
    course.Gradings = course.ParticipatingStudents.map(
      (student) => student.Id
    ).map((studentId) => buildGrading(studentId));

    // when
    const results = transform(
      course.ParticipatingStudents,
      course.Tests,
      course.Gradings
    );

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

  describe('MaxPoints from grades', () => {
    let studentGrade: NoResult;

    beforeEach(() => {
      let test = buildTest(1, 1, []);
      studentGrade = {
        kind: 'no-result',
        test: test,
      };
    });

    it('should get MaxPoints for test', () => {
      studentGrade.test.MaxPointsAdjusted = null;
      studentGrade.test.MaxPoints = 20;

      expect(toMaxPoints(studentGrade)).toEqual(20);
    });

    it('should get MaxPointsAdjusted for test', () => {
      studentGrade.test.MaxPointsAdjusted = 19;
      studentGrade.test.MaxPoints = 20;

      expect(toMaxPoints(studentGrade)).toEqual(19);
    });
  });
  describe('calculate averages for finalGrades', () => {
    const finalGrades: FinalGrade[] = [
      { id: 1, canGrade: true, average: 5, finalGradeId: 1005 },
      { id: 2, canGrade: true, average: 3, finalGradeId: 1003 },
      { id: 3, canGrade: true, average: 0, finalGradeId: null },
      { id: 4, canGrade: true, average: 4.5, finalGradeId: 1005 },
      { id: 5, canGrade: true, average: null, finalGradeId: null },
      { id: 6, canGrade: true, average: 6, finalGradeId: null },
    ];

    const scale: {
      Key: number;
      Value: string;
    }[] = [
      { Key: 1001, Value: '1.0' },
      { Key: 1002, Value: '2.0' },
      { Key: 1003, Value: '3.0' },
      { Key: 1004, Value: '4.0' },
      { Key: 1005, Value: '5.0' },
      { Key: 1006, Value: '6.0' },
    ];

    it('should calculate mean of student grades final grade averages', () => {
      expect(meanOf(finalGrades)).toBe(4.625);
    });

    it('should calculate mean of student grades of overwritten final grades using a given scale', () => {
      expect(meanOfGradesFromScale(scale, finalGrades)).toBe(4.333);
    });
  });
});
