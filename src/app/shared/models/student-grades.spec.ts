import { Course } from "src/app/shared/models/course.model";
import {
  buildCourse,
  buildGrading,
  buildResult,
  buildStudent,
  buildTest,
} from "src/spec-builders";
import {
  FinalGrade,
  NoResult,
  averageOfGradesForScale,
  meanOf,
  toMaxPoints,
  toMaxPointsAdjusted,
  transform,
} from "./student-grades";

describe("student-grade utils", () => {
  let course: Course;
  let finalGrades: ReadonlyArray<FinalGrade>;

  beforeEach(() => {
    course = buildCourse(123);
    course.ParticipatingStudents = [100, 200].map((id) => buildStudent(id));
    course.Tests = [1, 2, 3].map((id) =>
      buildTest(
        course.Id,
        id,
        [100, 200].map((studentid) => buildResult(id, studentid)),
      ),
    );
    course.Gradings = course.ParticipatingStudents.map(
      (student) => student.Id,
    ).map((studentId, index) => buildGrading(studentId, 5.75 - index));

    finalGrades = [
      {
        gradingId: 1,
        canGrade: true,
        average: 5,
        gradeId: 1005,
        finalGradeValue: "0",
      },
      {
        gradingId: 2,
        canGrade: true,
        average: 3,
        gradeId: 1003,
        finalGradeValue: "0",
      },
      {
        gradingId: 3,
        canGrade: true,
        average: 0,
        gradeId: undefined,
        finalGradeValue: "0",
      },
      {
        gradingId: 4,
        canGrade: true,
        average: 4.5,
        gradeId: 1005,
        finalGradeValue: "0",
      },
      {
        gradingId: 5,
        canGrade: true,
        average: undefined,
        gradeId: undefined,
        finalGradeValue: "0",
      },
      {
        gradingId: 6,
        canGrade: true,
        average: 6,
        gradeId: undefined,
        finalGradeValue: "0",
      },
    ];
  });

  describe("transform", () => {
    it("returns tests and grades for students with results", () => {
      const result = transform(
        course.ParticipatingStudents!,
        course.Tests!,
        course.Gradings!,
        [],
      );

      expect(result).toBeDefined();

      expect(result[0].student).toEqual(course.ParticipatingStudents![0]);
      expect(result[0].finalGrade.average).toBe(5.75);
      expect(result[0].finalGrade.gradeId).toBe(3);
      expect(result[0].grades.length).toBe(3);
      expect(
        result[0].grades.some((grade) => grade.kind === "no-result"),
      ).toBeFalsy();
      expect(
        result[0].grades.map((grade) =>
          grade.kind !== "no-result"
            ? [grade.result.TestId, grade.result.StudentId]
            : "",
        ),
      ).toEqual([
        [1, 100],
        [2, 100],
        [3, 100],
      ]);

      expect(result[1].student).toEqual(course.ParticipatingStudents![1]);
      expect(result[1].finalGrade.average).toBe(4.75);
      expect(result[1].finalGrade.gradeId).toBe(3);
      expect(result[1].grades.length).toBe(3);
      expect(
        result[1].grades.some((grade) => grade.kind === "no-result"),
      ).toBeFalsy();
      expect(
        result[1].grades.map((grade) =>
          grade.kind !== "no-result"
            ? [grade.result.TestId, grade.result.StudentId]
            : "",
        ),
      ).toEqual([
        [1, 200],
        [2, 200],
        [3, 200],
      ]);
    });

    it("returns tests and grades without results and final grades", () => {
      course.Tests = [1, 2, 3].map((id) => buildTest(course.Id, id, []));
      course.Gradings?.forEach((g) => {
        g.AverageTestResult = 0;
        g.GradeId = null;
      });

      const result = transform(
        course.ParticipatingStudents!,
        course.Tests,
        course.Gradings!,
        [],
      );

      expect(
        result[0].grades.every((grade) => grade.kind === "no-result"),
      ).toBeTruthy();
      expect(result[0].finalGrade.average).toBeUndefined();
      expect(result[0].finalGrade.gradeId).toBeUndefined();
      expect(result[0].finalGrade.canGrade).toBe(false);

      expect(
        result[1].grades.every((grade) => grade.kind === "no-result"),
      ).toBeTruthy();
      expect(result[1].finalGrade.average).toBeUndefined();
      expect(result[1].finalGrade.gradeId).toBeUndefined();
      expect(result[1].finalGrade.canGrade).toBe(false);
    });

    it("returns tests and grades but only one student has a result", () => {
      course.Tests = [1, 2, 3].map((id) =>
        buildTest(
          course.Id,
          id,
          [100].map((studentId) => buildResult(id, studentId)),
        ),
      );
      course.Gradings?.forEach((g) => {
        if (g.StudentId !== 100) {
          g.AverageTestResult = 0;
          g.GradeId = null;
        }
      });

      const result = transform(
        course.ParticipatingStudents!,
        course.Tests,
        course.Gradings!,
        [],
      );

      expect(
        result[0].grades.map((grade) =>
          grade.kind !== "no-result"
            ? [grade.result.TestId, grade.result.StudentId]
            : "no-result",
        ),
      ).toEqual([
        [1, 100],
        [2, 100],
        [3, 100],
      ]);
      expect(result[0].finalGrade.average).toBe(5.75);
      expect(result[0].finalGrade.gradeId).toBe(3);
      expect(result[0].finalGrade.canGrade).toBe(false);

      expect(
        result[1].grades.map((grade) =>
          grade.kind !== "no-result"
            ? [grade.result.TestId, grade.result.StudentId]
            : "no-result",
        ),
      ).toEqual([`no-result`, `no-result`, `no-result`]);
      expect(result[1].finalGrade.average).toBeUndefined();
      expect(result[1].finalGrade.gradeId).toBeUndefined();
      expect(result[1].finalGrade.canGrade).toBe(false);
    });

    it("returns tests and grades but without no-result grade where results are missing", () => {
      const course = buildCourse(123);
      course.ParticipatingStudents = [buildStudent(99)];
      course.Tests = [1, 2, 3].map((id) =>
        buildTest(course.Id, id, id % 2 === 0 ? [buildResult(id, 99)] : []),
      );
      course.Gradings = course.ParticipatingStudents.map(
        (student) => student.Id,
      ).map((studentId) => buildGrading(studentId));

      const result = transform(
        course.ParticipatingStudents,
        course.Tests,
        course.Gradings,
        [],
      );

      expect(result[0].student).toEqual(course.ParticipatingStudents[0]);
      expect(result[0].grades.length).toBe(3);
      expect(
        result[0].grades.map((grade) =>
          grade.kind !== "no-result"
            ? [grade.result.TestId, grade.result.StudentId]
            : "no-result",
        ),
      ).toEqual(["no-result", [2, 99], "no-result"]);
    });
  });

  describe("toMaxPoints", () => {
    let studentGrade: NoResult;

    beforeEach(() => {
      const test = buildTest(1, 1, []);
      studentGrade = {
        kind: "no-result",
        test: test,
      };
    });

    it("returns MaxPoints for test without MaxPointsAdjusted", () => {
      studentGrade.test.MaxPointsAdjusted = null;
      studentGrade.test.MaxPoints = 20;

      expect(toMaxPoints(studentGrade)).toBe(20);
    });

    it("returns MaxPoints for test with MaxPointsAdjusted", () => {
      studentGrade.test.MaxPointsAdjusted = 19;
      studentGrade.test.MaxPoints = 20;

      expect(toMaxPoints(studentGrade)).toBe(20);
    });

    it("returns 0 for test without MaxPoints or MaxPointsAdjusted", () => {
      studentGrade.test.MaxPointsAdjusted = null;
      studentGrade.test.MaxPoints = null;

      expect(toMaxPoints(studentGrade)).toBe(0);
    });
  });

  describe("toMaxPointsAdjusted", () => {
    let studentGrade: NoResult;

    beforeEach(() => {
      const test = buildTest(1, 1, []);
      studentGrade = {
        kind: "no-result",
        test: test,
      };
    });

    it("returns MaxPoints for test without MaxPointsAdjusted", () => {
      studentGrade.test.MaxPointsAdjusted = null;
      studentGrade.test.MaxPoints = 20;

      expect(toMaxPointsAdjusted(studentGrade)).toBe(20);
    });

    it("returns MaxPointsAdjusted for test with MaxPointsAdjusted", () => {
      studentGrade.test.MaxPointsAdjusted = 19;
      studentGrade.test.MaxPoints = 20;

      expect(toMaxPointsAdjusted(studentGrade)).toBe(19);
    });

    it("returns 0 for test without MaxPointsAdjusted or MaxPoints", () => {
      studentGrade.test.MaxPointsAdjusted = null;
      studentGrade.test.MaxPoints = null;

      expect(toMaxPointsAdjusted(studentGrade)).toBe(0);
    });
  });

  describe("meanOf", () => {
    describe("calculate averages for finalGrades", () => {
      it("returns mean of student grades final grade averages", () => {
        expect(meanOf(finalGrades)).toBe(4.625);
      });
    });
  });

  describe("averageOfGradesForScale", () => {
    let scale: ReadonlyArray<{
      Key: number;
      Value: string;
    }>;

    beforeEach(() => {
      scale = [
        { Key: 1001, Value: "1.0" },
        { Key: 1002, Value: "2.0" },
        { Key: 1003, Value: "3.0" },
        { Key: 1004, Value: "4.0" },
        { Key: 1005, Value: "5.0" },
        { Key: 1006, Value: "6.0" },
      ];
    });

    it("returns mean of student grades of overwritten final grades using a given scale", () => {
      expect(averageOfGradesForScale(finalGrades, scale)).toBe(
        4.333333333333333,
      );
    });
  });
});
