import * as t from "io-ts";
import { LocalDateTimeFromString, Maybe, Option } from "./common-types";

const Room = t.type({
  Id: t.number,
  Designation: t.string,
});

const LessonTeacher = t.type({
  PersonId: t.number,
  Lastname: t.string,
  Firstname: t.string,
  Id: t.number,
});

const TimetableEntry = t.type({
  Id: t.number,
  From: LocalDateTimeFromString,
  To: LocalDateTimeFromString,
  // Comment: Option(t.string),
  EventId: t.number,
  EventNumber: t.string,
  EventDesignation: t.string,
  // EventColor: t.number,
  EventLocation: Option(t.string),
  // EventManagerInformation: Maybe(t.string),
  // EventManagerId: t.number,
  // EventManagerLastname: Option(t.string),
  // EventManagerFirstname: Option(t.string),
  // EventManagers: Maybe(t.readonlyArray(t.type({ Id: t.number, Designation: t.string }))),
  // LessonTeacherId: t.number,
  // LessonTeacherLastname: t.string,
  // LessonTeacherFirstname: t.string,
  LessonTeachers: Maybe(t.readonlyArray(LessonTeacher)),
  // RoomId: t.number,
  // Room: t.string,
  Rooms: Maybe(t.readonlyArray(Room)),
  // HRef: Option(t.string),
});

type TimetableEntry = t.TypeOf<typeof TimetableEntry>;
type LessonTeacher = t.TypeOf<typeof LessonTeacher>;
type Room = t.TypeOf<typeof Room>;
export { TimetableEntry, LessonTeacher, Room };
