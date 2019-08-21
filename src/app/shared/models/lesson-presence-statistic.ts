import { Reference } from './common-types';
import * as t from 'io-ts';

const LessonPresenceStatistic = t.type({
  StudentRef: Reference,
  StudentFullName: t.string,
  TotalAbsences: t.string,
  TotalAbsencesUnconfirmed: t.number,
  TotalAbsencesValidExcuse: t.number,
  TotalAbsencesWithoutExcuse: t.number,
  TotalDispensations: t.number,
  TotalHalfDays: t.number,
  TotalIncidents: t.number,
  Href: t.string
});

type LessonPresenceStatistic = t.TypeOf<typeof LessonPresenceStatistic>;
export { LessonPresenceStatistic };

export type LessonPresenceStatisticProps = t.PropsOf<
  typeof LessonPresenceStatistic
>;
