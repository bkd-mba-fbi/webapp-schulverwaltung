import { Course } from '../../shared/models/course.model';
import { EventState } from '../services/events-state.service';

export function getState(course: Course): Option<EventState> {
  const courseStatus = course.EvaluationStatusRef;

  if (courseStatus.HasTestGrading === true) {
    return EventState.Tests;
  }

  if (courseStatus.HasEvaluationStarted === true) {
    if (courseStatus.EvaluationUntil == null) {
      return EventState.IntermediateRating;
    }

    if (courseStatus.EvaluationUntil >= new Date()) {
      return EventState.RatingUntil;
    }
  }

  return null;
}

export function canSetFinalGrade(course: Course): boolean {
  const status = course.EvaluationStatusRef;

  return (
    status.HasEvaluationStarted === true &&
    ((status?.EvaluationUntil && status?.EvaluationUntil >= new Date()) ||
      status.EvaluationUntil === null ||
      status.EvaluationUntil === undefined)
  );
}