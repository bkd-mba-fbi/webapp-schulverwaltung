import * as t from "io-ts";
import { Reference } from "./common-types";

const LessonStudyClass = t.type({
  LessonRef: Reference,
  EventRef: Reference,
  StudyClassNumber: t.string,
});
type LessonStudyClass = t.TypeOf<typeof LessonStudyClass>;
export { LessonStudyClass };
