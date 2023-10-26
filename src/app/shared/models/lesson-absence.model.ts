import * as t from "io-ts";
import { Reference, Option, LocalDateTimeFromString } from "./common-types";

const id = t.type({
  Id: t.number,
});

const LessonHRef = t.partial({
  HRef: Option(t.string),
});

const ExpandedLessonRef = t.partial({
  From: LocalDateTimeFromString,
  To: LocalDateTimeFromString,
  EventNumber: t.string,
  EventDesignation: t.string,
  Designation: Option(t.string),
});

const LessonRef = t.intersection([id, LessonHRef, ExpandedLessonRef]);

const LessonAbsence = t.type({
  Id: t.string,
  LessonRef,
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
