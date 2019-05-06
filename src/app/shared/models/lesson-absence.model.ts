import { RestModel } from './rest.model';
import { Reference } from './common-types';

export class LessonAbsence extends RestModel {
  LessonRef: Reference;
  StudentRef: Reference;
  TypeRef: Reference;
  ConfirmationState: Option<string>;
  ConfirmationStateId: number;
  Comment: Option<string>;
  StudentFullName: string;
  Type: Option<string>;
  Href: string;
}
