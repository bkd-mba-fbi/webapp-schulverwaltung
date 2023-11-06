import * as t from "io-ts";
import {
  LocalDateFromString,
  LocalDateTimeFromString,
  Option,
  OptionalReference,
  Reference,
} from "./common-types";

const LessonPresence = t.type({
  Id: t.string,
  LessonRef: Reference,
  StudentRef: Reference,
  EventRef: Reference,
  TypeRef: OptionalReference,
  RegistrationRef: OptionalReference,
  StudyClassRef: OptionalReference,
  // EventTypeId: t.number,
  // ConfirmationState: Option(t.string),
  ConfirmationStateId: Option(t.number),
  EventDesignation: t.string,
  // EventNumber: t.string,
  HasStudyCourseConfirmationCode: t.boolean,
  // IsReadOnly: t.boolean,
  LessonDateTimeFrom: LocalDateTimeFromString,
  LessonDateTimeTo: LocalDateTimeFromString,
  Comment: Option(t.string),
  Date: Option(LocalDateFromString),
  Type: Option(t.string),
  StudentFullName: t.string,
  // StudyClassDesignation: t.string,
  StudyClassNumber: t.string,
  TeacherInformation: t.string,
});
type LessonPresence = t.TypeOf<typeof LessonPresence>;
export { LessonPresence };
