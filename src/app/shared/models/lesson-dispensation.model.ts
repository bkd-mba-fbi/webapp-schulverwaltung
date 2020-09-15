import * as t from 'io-ts';
import { Reference, Option } from './common-types';

// TODO: complete properties
const LessonDispensation = t.type({
  Id: t.string,
  LessonRef: Reference,
  StudentRef: Reference,
  TypeRef: Reference,
  Type: Option(t.string),
  Comment: Option(t.string),
  StudentFullName: t.string,
  HRef: t.string,
  // RegistrationId:t.number
});
type LessonDispensation = t.TypeOf<typeof LessonDispensation>;
export { LessonDispensation };
