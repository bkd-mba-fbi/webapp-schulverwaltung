import * as t from 'io-ts';
import { Reference, Option } from './common-types';

const LessonIncident = t.type({
  LessonRef: Reference,
  StudentRef: Reference,
  TypeRef: Reference,
  Comment: Option(t.string),
  StudentFullName: t.string,
  Type: Option(t.string),
  HRef: t.string,
});
type LessonIncident = t.TypeOf<typeof LessonIncident>;
export { LessonIncident };
