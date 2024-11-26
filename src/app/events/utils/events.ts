import { Event } from "src/app/shared/models/event.model";
import { TokenPayload } from "src/app/shared/models/token-payload.model";
import { Course } from "../../shared/models/course.model";
import { EventState } from "../services/events-state.service";

export type EventStateWithLabel = {
  value: EventState;
  label?: string;
};

const INTERMEDIATE_RATING_STATUS_ID = 10300;
const DEFINITIVELY_EVALUATED_STATUS_ID = 10260;
const REVIEW_EVALUATED_STATUS_ID = 10250;
const CAS_ACTIVE_STATUS_ID = 14030;
const COURSE_ACTIVE_STATUS_ID = 10350;

/**
 * Returns the event state with an optional label based on the given
 * course's evaluation and test status. See #427
 */
export function getEventState(course: Course): Option<EventStateWithLabel> {
  const { HasEvaluationStarted, EvaluationUntil, HasTestGrading } =
    course.EvaluationStatusRef;

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
    course.StatusId !== DEFINITIVELY_EVALUATED_STATUS_ID &&
    course.StatusId !== REVIEW_EVALUATED_STATUS_ID
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

export function getCourseDesignation(course: Course): string {
  const classes = course.Classes
    ? course.Classes.map((c) => c.Number).join(", ")
    : null;

  return classes ? course.Designation + ", " + classes : course.Designation;
}

/**
 * Returns whether the user with the given token payload is leader of the given
 * study course.
 */
export function isStudyCourseLeader(
  tokenPayload: Option<TokenPayload>,
  studyCourse: Event,
): boolean {
  if (!tokenPayload) return false;

  // As a workaround (since the API does not provide the ID of the leadership
  // and the `/EventLeaderships` are not accessible with the Tutoring token), we
  // compare the user's fullname with the event's `Leadership` field containing
  // the names of all leaders for now.
  return (studyCourse.Leadership ?? "")
    .split(",")
    .some((leader) => leader.trim() === tokenPayload.fullname);
}
