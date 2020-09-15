import * as t from 'io-ts';
import { Reference, Option } from './common-types';

const LessonAbsence = t.type({
  Id: t.string,
  LessonRef: Reference,
  StudentRef: Reference,
  TypeRef: Reference,
  Type: Option(t.string),
  ConfirmationState: Option(t.string),
  ConfirmationStateId: t.number,
  Comment: Option(t.string),
  StudentFullName: t.string,
  // IsHalfDayAbsence: t.boolean,
  // HalfDayPoint: Option(/* number maybe? */),
  RegistrationId: t.number,
  HRef: t.string,
});
type LessonAbsence = t.TypeOf<typeof LessonAbsence>;
export { LessonAbsence };
