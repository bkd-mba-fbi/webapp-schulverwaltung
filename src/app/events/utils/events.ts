import { Course } from '../../shared/models/course.model';
import { EventState } from '../services/events-state.service';

export type EventStateWithLabel = {
  value: EventState;
  label?: string;
};

/**
 * Returns the event state with an optional label based on the given
 * course's evaluation and test status. See #427
 */
export function getEventState(course: Course): Option<EventStateWithLabel> {
  const {
    HasEvaluationStarted,
    HasReviewOfEvaluationStarted,
    EvaluationUntil,
    HasTestGrading,
  } = course.EvaluationStatusRef;

  if (
    HasEvaluationStarted === true &&
    (course.StatusId === 14030 || course.StatusId === 10350)
  ) {
    // Bewertung
    return {
      value: EventState.Rating,
    };
  }

  if (HasEvaluationStarted === true && HasTestGrading === false) {
    if (EvaluationUntil) {
      // Bewertung bis
      return {
        value: EventState.RatingUntil,
      };
    } else if (course.StatusId === 10300) {
      // Zwischenbewertung
      return {
        value: EventState.IntermediateRating,
      };
    }
  }

  if (
    HasEvaluationStarted === false &&
    HasTestGrading === true &&
    HasReviewOfEvaluationStarted === false &&
    course.StatusId !== 10260
  ) {
    // Tests erfassen
    return {
      value: EventState.Tests,
    };
  }

  if (HasEvaluationStarted === true && HasTestGrading === true) {
    if (EvaluationUntil) {
      // Test erfassen, Label Bewertung bis
      return {
        value: EventState.Tests,
        label: EventState.RatingUntil,
      };
    } else {
      // Test erfassen, Label Zwischenbewertung
      return {
        value: EventState.Tests,
        label: EventState.IntermediateRating,
      };
    }
  }

  return null;
}

export function canSetFinalGrade(course: Course): boolean {
  const { HasEvaluationStarted, EvaluationUntil } = course.EvaluationStatusRef;
  return (
    HasEvaluationStarted === true &&
    ((EvaluationUntil && EvaluationUntil >= new Date()) || !EvaluationUntil)
  );
}

export function isRated(course: Course): boolean {
  return (
    course.EvaluationStatusRef.HasReviewOfEvaluationStarted === true &&
    !!course.FinalGrades?.length
  );
}
