import { RestModel } from './rest.model';
import { Reference } from './common-types';

export class LessonDispensation extends RestModel {
  LessonRef: Reference;
  StudentRef: Reference;
  TypeRef: Reference;
  Comment: Option<string>;
  StudentFullName: string;
  Type: Option<string>;
  Href: string;
}
