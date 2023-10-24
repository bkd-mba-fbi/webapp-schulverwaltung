import { FinalGrading, Grading } from '../models/course.model';
import { Grade, GradingScale } from '../models/grading-scale.model';

/**
 * The relevant grade value for a student dossier may be present either in the Grading or the FinalGrading,
 * and the grading may contain a GradeValue (freehand gradings) or GradeId if grading is bound to a gradingScale.
 * In this case - GradingScale.Designation is used, not GradingScale.Value since that would be empty for value like "besucht" or "keine Note".
 * If a finalGrade is available - the finalGrades Grade is used
 * @param grading
 * @param finalGrade
 * @param gradingScale
 * @returns
 */
export function evaluate(
  grading: Option<Grading>,
  finalGrade: Option<FinalGrading>,
  gradingScale: Option<GradingScale>,
): Maybe<string | number> {
  if (finalGrade) return finalGrade.Grade;
  return findInScale(grading, gradingScale) || grading?.GradeValue;
}

function findInScale(
  grading: Option<Grading>,
  gradingScale: Option<GradingScale>,
): Maybe<string> {
  return gradingScale?.Grades.find(
    (grade: Grade) => grade.Id === grading?.GradeId,
  )?.Designation;
}
