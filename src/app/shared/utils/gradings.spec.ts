import { FinalGrading, Grading } from "../models/course.model";
import { GradingScale, Grade } from "../models/grading-scale.model";
import * as Gradings from "./gradings";

describe("gradings", () => {
  let gradingScale: GradingScale;

  beforeEach(() => {
    gradingScale = {
      Grades: [
        { Id: 1001, Designation: 1 } as unknown as Grade,
        { Id: 1002, Designation: 2 } as unknown as Grade,
        { Id: 1003, Designation: 3 } as unknown as Grade,
        { Id: 1004, Designation: 4 } as unknown as Grade,
        { Id: 1005, Designation: 5 } as unknown as Grade,
        { Id: 1006, Designation: 6 } as unknown as Grade,
      ],
    } as unknown as GradingScale;
  });
  it("should get grading value", () => {
    const grading: Grading = {
      GradeValue: 4.5,
    } as unknown as Grading;

    const finalGrade = null;

    expect(Gradings.evaluate(grading, finalGrade, gradingScale)).toBe(4.5);
  });

  it("should get null if no value is set", () => {
    const grading: Grading = {
      GradeValue: null,
    } as unknown as Grading;

    const finalGrade = null;

    expect(Gradings.evaluate(grading, finalGrade, gradingScale)).toBe(null);
  });

  it("should get from scale if gradeId is set", () => {
    const grading: Grading = {
      GradeValue: null,
      GradeId: 1003,
    } as unknown as Grading;

    const finalGrade = null;

    expect(Gradings.evaluate(grading, finalGrade, gradingScale)).toBe(3);
  });

  it("should evaluate from final grade", () => {
    const grading: Grading = {
      GradeValue: null,
      GradeId: 1003,
    } as unknown as Grading;

    const finalGrade: FinalGrading = {
      GradeValue: 4.5,
      Grade: "4.5",
    } as unknown as FinalGrading;

    expect(Gradings.evaluate(grading, finalGrade, gradingScale)).toBe("4.5");
  });
});
