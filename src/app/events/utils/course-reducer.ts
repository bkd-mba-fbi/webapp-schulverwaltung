import { Course, Grading } from '../../shared/models/course.model';
import { Result } from '../../shared/models/test.model';
import { removeTestById, replaceResult, toggleIsPublished } from './tests';
import { changeGrading, replaceGrading } from './gradings';

export type TestsAction =
  | { type: 'reset'; payload: Course }
  | {
      type: 'updateResult';
      payload: { testResult: Result; grading: Grading };
    }
  | { type: 'toggle-test-state'; payload: number }
  | {
      type: 'final-grade-overwritten';
      payload: { id: number; selectedGradeId: number };
    }
  | { type: 'replace-grades'; payload: Grading[] }
  | { type: 'delete-test'; payload: number };

export function courseReducer(
  course: Option<Course>,
  action: TestsAction
): Option<Course> {
  switch (action.type) {
    case 'reset':
      return action.payload;
    case 'updateResult':
      return course
        ? {
            ...course,
            Tests: replaceResult(action.payload.testResult, course.Tests || []),
            Gradings: replaceGrading(
              action.payload.grading,
              course.Gradings || []
            ),
          }
        : null;
    case 'toggle-test-state':
      return course
        ? {
            ...course,
            Tests: toggleIsPublished(action.payload, course.Tests || []),
          }
        : null;
    case 'final-grade-overwritten':
      return course
        ? {
            ...course,
            Gradings: changeGrading(
              {
                id: action.payload.id,
                selectedGradeId: action.payload.selectedGradeId,
              },
              course.Gradings || []
            ),
          }
        : null;
    case 'replace-grades': {
      return course
        ? {
            ...course,
            Gradings: action.payload,
          }
        : null;
    }
    case 'delete-test':
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
