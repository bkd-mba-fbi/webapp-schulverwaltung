import { Course } from '../../shared/models/course.model';
import { EventState } from '../services/events-state.service';

export type EventStateWithLabel = {
  value: EventState;
  label?: string;
};

// To understand this logic see
// https://github.com/bkd-mba-fbi/webapp-schulverwaltung/issues/427
export function getEventState(course: Course): Option<EventStateWithLabel> {
  const courseStatus = course.EvaluationStatusRef;

  if (
    courseStatus.HasEvaluationStarted === true &&
    (course.StatusId === 14030 || course.StatusId === 10350)
  ) {
    // Bewertung
    return {
      value: EventState.Rating,
    };
  }

  if (
    courseStatus.HasEvaluationStarted === true &&
    courseStatus.HasTestGrading === false
  ) {
    if (
      courseStatus.EvaluationUntil
    ) {
      // Bewertung bis
      return {
        value: EventState.RatingUntil,
      };
    }

    if (
      (courseStatus.EvaluationUntil === null ||
        courseStatus.EvaluationUntil === undefined) &&
      course.StatusId === 10300
    ) {
      // Zwischenbewertung
      return {
        value: EventState.IntermediateRating,
      };
    }
  }

  if (
    courseStatus.HasEvaluationStarted === false &&
    courseStatus.HasTestGrading === true &&
    courseStatus.HasReviewOfEvaluationStarted === false &&
    course.StatusId !== 10260
  ) {
    // Tests erfassen
    return {
      value: EventState.Tests,
    };
  }

  if (
    courseStatus.HasEvaluationStarted === true &&
    courseStatus.HasTestGrading === true
  ) {
    if (
      courseStatus.EvaluationUntil === null ||
      courseStatus.EvaluationUntil === undefined
    ) {
      // Test erfassen, Label Zwischenbewertung
      return {
        value: EventState.Tests,
        label: EventState.IntermediateRating,
      };
    } else if (courseStatus.EvaluationUntil) {
      // Test erfassen, Label Bewertung bis
      return {
        value: EventState.Tests,
        label: EventState.RatingUntil,
      };
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

export function isRated(course: Course): boolean {
  return (
    course.EvaluationStatusRef.HasReviewOfEvaluationStarted === true &&
    !!course.FinalGrades?.length
  );
}
