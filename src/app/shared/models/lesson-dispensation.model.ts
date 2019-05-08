import * as t from 'io-ts';
import { Reference, Option } from './common-types';

const LessonDispensation = t.type({
  LessonRef: Reference,
  StudentRef: Reference,
  TypeRef: Reference,
  Comment: Option(t.string),
  StudentFullName: t.string,
  Type: Option(t.string),
  Href: t.string
});
type LessonDispensation = t.TypeOf<typeof LessonDispensation>;
export { LessonDispensation };

export type LessonDispensationProps = t.PropsOf<typeof LessonDispensation>;
