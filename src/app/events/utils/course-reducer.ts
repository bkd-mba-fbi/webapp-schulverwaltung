import { Course, Grading } from "../../shared/models/course.model";
import { Result } from "../../shared/models/test.model";
import { changeGrading, replaceGrading } from "./gradings";
import {
  deleteResult,
  removeTestById,
  replaceResult,
  toggleIsPublished,
} from "./tests";

export type TestsAction =
  | { type: "reset"; payload: Course }
  | {
      type: "updateResult";
      payload: {
        testResult: Result;
        grading: Option<Grading>;
        /**
         * If set, ignores the corresponding value (keeps the old one). Use this
         * to avoid overwriting optimistic updates by responses from the server
         * from previous requests.
         */
        ignore?: "grade" | "points";
      };
    }
  | {
      type: "deleteResult";
      payload: { testId: number; studentId: number; grading: Option<Grading> };
    }
  | { type: "toggle-test-state"; payload: number }
  | {
      type: "final-grade-overwritten";
      payload: { id: number; selectedGradeId: Option<number> };
    }
  | { type: "replace-grades"; payload: Grading[] }
  | { type: "delete-test"; payload: number };

export function courseReducer(
  course: Option<Course>,
  action: TestsAction,
): Option<Course> {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "updateResult":
      return course
        ? {
            ...course,
            Tests: replaceResult(
              action.payload.testResult,
              course.Tests || [],
              action.payload.ignore,
            ),
            Gradings: action.payload.grading
              ? replaceGrading(action.payload.grading, course.Gradings || [])
              : course.Gradings,
          }
        : null;
    case "deleteResult":
      return course
        ? {
            ...course,
            Tests: deleteResult(
              action.payload.testId,
              action.payload.studentId,
              course.Tests || [],
            ),
            Gradings: action.payload.grading
              ? replaceGrading(action.payload.grading, course.Gradings || [])
              : course.Gradings || [],
          }
        : null;
    case "toggle-test-state":
      return course
        ? {
            ...course,
            Tests: toggleIsPublished(action.payload, course.Tests || []),
          }
        : null;
    case "final-grade-overwritten":
      return course
        ? {
            ...course,
            Gradings: changeGrading(
              {
                id: action.payload.id,
                selectedGradeId: action.payload.selectedGradeId,
              },
              course.Gradings || [],
            ),
          }
        : null;
    case "replace-grades": {
      return course
        ? {
            ...course,
            Gradings: action.payload,
          }
        : null;
    }
    case "delete-test":
      return course
        ? {
            ...course,
            Tests: removeTestById(action.payload, course.Tests || []),
          }
        : null;
    default:
      return course;
  }
}
