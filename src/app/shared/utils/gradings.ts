import { FinalGrading, Grading } from '../models/course.model';
import { Grade, GradingScale } from '../models/grading-scale.model';

/**
 * The relevant grade value for a student dossier may be present either in the Grading or the FinalGrading,
 * and the grading may contain a GradeValue (freehand gradings) or GradeId if grading is bound to a gradingScale
 * If a finalGrade is available - the finalGrades GradeValue is used
 * @param grading
 * @param finalGrade
 * @param gradingScale
 * @returns
 */
export function evaluate(
  grading: Grading,
  finalGrade: Option<FinalGrading>,
  gradingScale: GradingScale
): Option<number> {
  if (finalGrade && finalGrade.GradeValue) return finalGrade.GradeValue;
  return findInScale(grading, gradingScale) || grading.GradeValue;
}

function findInScale(
  grading: Grading,
  gradingScale: GradingScale
): Maybe<number> {
  return gradingScale.Grades.find(
    (grade: Grade) => grade.Id === grading.GradeId
  )?.Value;
}
