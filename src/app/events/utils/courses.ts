import { Course } from '../../shared/models/course.model';

export enum CourseState {
  Rating = 'rating',
  RatingUntil = 'rating-until',
  IntermediateRating = 'intermediate-rating',
  Tests = 'add-tests',
}

export function getState(course: Course): Option<CourseState> {
  const courseStatus = course.EvaluationStatusRef;

  if (courseStatus.HasTestGrading === true) {
    return CourseState.Tests;
  }

  if (courseStatus.HasEvaluationStarted === true) {
    if (courseStatus.EvaluationUntil == null) {
      return CourseState.IntermediateRating;
    }

    if (courseStatus.EvaluationUntil >= new Date()) {
      return CourseState.RatingUntil;
    }
  }

  return null;
}
