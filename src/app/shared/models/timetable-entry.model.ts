import * as t from "io-ts";
import { LocalDateTimeFromString, Option } from "./common-types";

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
  EventManagerInformation: t.string,
  // EventManagerId: t.number,
  // EventManagerLastname: Option(t.string),
  // EventManagerFirstname: Option(t.string),
  // EventManagers: Maybe(t.array(t.type({ Id: t.number, Designation: t.string }))),
  // LessonTeacherId: t.number,
  // LessonTeacherLastname: t.string,
  // LessonTeacherFirstname: t.string,
  // RoomId: t.number,
  // Room: t.string,
  // HRef: Option(t.string),
});
type TimetableEntry = t.TypeOf<typeof TimetableEntry>;
export { TimetableEntry };
