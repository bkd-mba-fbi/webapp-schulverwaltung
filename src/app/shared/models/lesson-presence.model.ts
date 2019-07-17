import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { Reference, OptionalReference, Option, Maybe } from './common-types';

const LessonPresence = t.type({
  Id: t.string,
  LessonRef: Reference,
  StudentRef: Reference,
  EventRef: Reference,
  TypeRef: OptionalReference,
  StudyClassRef: Reference,
  EventTypeId: t.number,
  ConfirmationState: Option(t.string),
  ConfirmationStateId: Option(t.number),
  EventDesignation: t.string,
  EventNumber: t.string,
  HasStudyCourseConfirmationCode: t.boolean,
  IsReadOnly: t.boolean,
  LessonDateTimeFrom: DateFromISOString,
  LessonDateTimeTo: DateFromISOString,
  Comment: Option(t.string),
  Date: Option(DateFromISOString),
  Type: Option(t.string),
  StudentFullName: t.string,
  StudyClassDesignation: t.string,
  StudyClassNumber: t.string,
  TeacherInformation: t.string,
  WasAbsentInPrecedingLesson: Maybe(t.boolean)
});
type LessonPresence = t.TypeOf<typeof LessonPresence>;
export { LessonPresence };

export type LessonPresenceProps = t.PropsOf<typeof LessonPresence>;
