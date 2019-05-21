import { Reference, Flag } from './app/shared/models/common-types';
import { LessonPresence } from './app/shared/models/lesson-presence.model';
import { Lesson } from './app/shared/models/lesson.model';
import { PresenceType } from './app/shared/models/presence-type.model';
import { PresenceControlEntry } from './app/presence-control/models/presence-control-entry.model';

export function buildReference(id = 123, href?: string): Reference {
  return { Id: id, Href: href || `/${id}` };
}

export function buildLessonPresence(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string,
  studentName = ''
): LessonPresence {
  return {
    LessonRef: buildReference(lessonId),
    StudentRef: buildReference(),
    EventRef: buildReference(),
    PresenceTypeRef: null,
    StudyClassRef: buildReference(),
    EventTypeId: 123,
    PresenceConfirmationState: null,
    PresenceConfirmationStateId: null,
    EventDesignation: eventDesignation,
    EventNumber: '',
    HasStudyCourseConfirmationCode: 0,
    IsReadOnly: 0,
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    PresenceComment: null,
    PresenceDate: null,
    PresenceType: null,
    StudentFullName: studentName,
    StudyClassDesignation: '',
    StudyClassNumber: '9a',
    TeacherInformation: '',
    WasAbsentInPrecedingLesson: null,
    Href: ''
  };
}

export function buildLesson(
  lessonId: number,
  dateFrom: Date,
  dateTo: Date,
  eventDesignation: string
): Lesson {
  return {
    LessonRef: buildReference(lessonId),
    EventDesignation: eventDesignation,
    LessonDateTimeFrom: dateFrom,
    LessonDateTimeTo: dateTo,
    StudyClassNumber: '9a'
  };
}

export function buildPresenceControlEntry(
  lessonPresence: LessonPresence,
  presenceType: Option<PresenceType>
): PresenceControlEntry {
  return new PresenceControlEntry(lessonPresence, presenceType);
}

export function buildPresenceType(
  id: number,
  typeId: number,
  isAbsence: Flag,
  IsIncident: Flag
): PresenceType {
  return {
    Id: id,
    TypeId: typeId,
    Active: 1,
    Description: '',
    Designation: '',
    IsAbsence: isAbsence,
    IsComment: 0,
    IsDispensation: 0,
    IsIncident: IsIncident,
    NeedsConfirmation: 1,
    Sort: 1,
    Href: ''
  };
}
