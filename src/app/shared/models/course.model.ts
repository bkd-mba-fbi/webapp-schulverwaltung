import * as t from 'io-ts';
import {
  LocalDateFromString,
  LocalDateTimeFromString,
  Option,
} from './common-types';
import { StudyClass } from './study-class.model';
import { Test } from './test.model';

const id = t.type({
  Id: t.number,
});

const HRef = t.partial({
  HRef: Option(t.string),
});

const ExpandedEvaluationStatusRef = t.partial({
  HasEvaluationStarted: t.boolean,
  EvaluationUntil: Option(LocalDateFromString),
  HasReviewOfEvaluationStarted: t.boolean,
  HasTestGrading: t.boolean,
  Id: t.number,
});

const EvaluationStatusRef = t.intersection([
  id,
  HRef,
  ExpandedEvaluationStatusRef,
]);

const ExpandedAttendanceRef = t.partial({
  Id: t.number,
  // EventId: t.number,
  StudentCount: t.number,
  // MaxStudents: t.number,
  // MinStudents: t.number,
});

const AttendanceRef = t.intersection([id, HRef, ExpandedAttendanceRef]);

const Course = t.type({
  HRef: t.string,
  Id: t.number,
  Number: t.string,
  Designation: t.string,
  // HostId: t.string,
  // Host: t.string,
  // Management: t.string,
  // MaxParticipants: t.number,
  // MinParticipants: t.number,
  // Weekday: t.string,
  DateFrom: LocalDateTimeFromString,
  DateTo: LocalDateTimeFromString,
  // LessonFrequency: t.number,
  // Location: t.string,
  // TimeFrom: LocalDateTimeFromString,
  // TimeTo: LocalDateTimeFromString,
  // ConductOfCourse: null,
  // RegistrationFrom: null,
  // RegistrationTo: null,
  // Price: 0.0000,
  // Credits: 2.0,
  // LanguageOfInstruction: null,
  // Url: null,
  // Color: null,
  // IsPublished: t.boolean,
  // LevelId: t.number,
  // Level: t.string,
  // StatusId: t.number,
  // Status: t.string,
  // Lessons: null,
  // EventManagers: null,
  // MainEventManagers: null,
  // TimetableEntries: null,
  // GradingScaleId: t.number,
  // FinalGrades: null,
  // Gradings: null,
  Tests: Option(t.array(Test)),
  EvaluationStatusRef,
  AttendanceRef,
  // ParticipatingStudents: null,
  Classes: Option(t.array(StudyClass)),
});
type Course = t.TypeOf<typeof Course>;
export { Course };
