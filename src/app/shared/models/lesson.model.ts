import * as t from "io-ts";
import { Reference, LocalDateTimeFromString } from "./common-types";

const Lesson = t.type({
  LessonRef: Reference,
  EventRef: Reference,
  EventDesignation: t.string,
  StudyClassNumber: t.string,
  TeacherInformation: t.string,
  LessonDateTimeFrom: LocalDateTimeFromString,
  LessonDateTimeTo: LocalDateTimeFromString,
});
type Lesson = t.TypeOf<typeof Lesson>;
export { Lesson };
