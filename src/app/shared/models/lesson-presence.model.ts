import { Reference, Flag } from './common-types';

export interface LessonPresence {
  LessonRef: Reference;
  StudentRef: Reference;
  EventRef: Reference;
  PresenceTypeRef: Option<Reference>;
  StudyClassRef: Reference;
  EventTypeId: number;
  PresenceConfirmationState: string;
  PresenceConfirmationStateId: number;
  EventDesignation: string;
  EventNumber: string;
  HasStudyCourseConfirmationCode: string;
  IsReadOnly: Flag;
  LessonDateTimeFrom: string; // 2019-04-25T07:45:00;
  LessonDateTimeTo: string; // 2019-04-25T08:30:00;
  PresenceComment: Option<string>;
  PresenceDate: string; // 2019-04-18;
  PresenceType: Option<string>;
  StudentFullName: string;
  StudyClassDesignation: string;
  StudyClassNumber: string;
  TeacherInformation: string;
  WasAbsentInPrecedingLesson: Flag;
  Href: string;
}
