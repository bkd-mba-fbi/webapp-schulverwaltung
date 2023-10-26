import { Reference } from "./common-types";
import * as t from "io-ts";

const LessonPresenceStatistic = t.type({
  StudentRef: Reference,
  StudentFullName: t.string,
  TotalAbsences: t.number,
  TotalAbsencesUnconfirmed: t.number,
  TotalAbsencesValidExcuse: t.number,
  TotalAbsencesWithoutExcuse: t.number,
  TotalAbsencesUnchecked: t.number,
  TotalDispensations: t.number,
  TotalHalfDays: t.number,
  TotalIncidents: t.number,
});

type LessonPresenceStatistic = t.TypeOf<typeof LessonPresenceStatistic>;
export { LessonPresenceStatistic };
