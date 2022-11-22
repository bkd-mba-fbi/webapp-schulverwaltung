import { Course } from '../../shared/models/course.model';
import { EventState } from '../services/events-state.service';

export type EventStateWithLabel = {
  value: EventState;
  label?: string;
};

const INTERMEDIATE_RATING_STATUS_ID = 10300;
const DEFINITIVELY_EVALUATED_STATUS_ID = 10260;
const CAS_ACTIVE_STATUS_ID = 14030;
const COURSE_ACTIVE_STATUS_ID = 10350;

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
    (course.StatusId === CAS_ACTIVE_STATUS_ID ||
      course.StatusId === COURSE_ACTIVE_STATUS_ID)
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
    } else if (course.StatusId === INTERMEDIATE_RATING_STATUS_ID) {
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
    course.StatusId !== DEFINITIVELY_EVALUATED_STATUS_ID
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
  return course.EvaluationStatusRef.HasEvaluationStarted === true;
}

export function isRated(course: Course): boolean {
  return (
    course.EvaluationStatusRef.HasReviewOfEvaluationStarted === true &&
    !!course.FinalGrades?.length
  );
}
