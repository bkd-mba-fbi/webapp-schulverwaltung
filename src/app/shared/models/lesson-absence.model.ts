import * as t from 'io-ts';
import { Reference, Option } from './common-types';

const LessonAbsence = t.type({
  LessonRef: Reference,
  StudentRef: Reference,
  TypeRef: Reference,
  ConfirmationState: Option(t.string),
  ConfirmationStateId: t.number,
  Comment: Option(t.string),
  StudentFullName: t.string,
  Type: Option(t.string),
  HRef: t.string
});
type LessonAbsence = t.TypeOf<typeof LessonAbsence>;
export { LessonAbsence };

export type LessonAbsenceProps = t.PropsOf<typeof LessonAbsence>;
