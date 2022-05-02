import * as t from 'io-ts';
import { LocalDateTimeFromString, Option } from './common-types';
import { Student } from './student.model';
import { StudyClass } from './study-class.model';
import { Result, Test } from './test.model';

const id = t.type({
  Id: t.number,
});

const HRef = t.partial({
  HRef: Option(t.string),
});

const ExpandedEvaluationStatusRef = t.partial({
  HasEvaluationStarted: t.boolean,
  EvaluationUntil: Option(LocalDateTimeFromString),
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

const Grading = t.type({
  AverageTestResult: t.number,
  CanGrade: t.boolean,
  EventDesignation: t.string,
  EventId: t.number,
  EventNumber: t.string,
  GradeComment: Option(t.string),
  GradeId: Option(t.number),
  GradeValue: Option(t.number),
  // HRef: t.string,
  Id: t.number,
  StudentFullName: t.string,
  StudentId: t.number,
  StudentMatriculationNumber: Option(t.number),
  StudentNameTooltip: t.string,
});

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
  DateFrom: Option(LocalDateTimeFromString),
  DateTo: Option(LocalDateTimeFromString),
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
  StatusId: t.number,
  // Status: t.string,
  // Lessons: null,
  // EventManagers: null,
  // MainEventManagers: null,
  // TimetableEntries: null,
  GradingScaleId: t.number,
  // FinalGrades: null,
  Gradings: Option(t.array(Grading)),
  Tests: Option(t.array(Test)),
  EvaluationStatusRef,
  AttendanceRef,
  ParticipatingStudents: Option(t.array(Student)),
  Classes: Option(t.array(StudyClass)),
});

const TestPointsResult = t.type({
  StudentIds: t.array(t.number),
  TestId: t.number,
  Points: Option(t.number),
});

const TestGradesResult = t.type({
  StudentIds: t.array(t.number),
  TestId: t.number,
  GradeId: Option(t.number),
});

const UpdatedTestResultResponse = t.type({
  TestResults: t.array(Result),
  Gradings: t.array(Grading),
});

const AverageTestResultResponse = t.type({
  Gradings: t.array(Grading),
});

type Course = t.TypeOf<typeof Course>;
type Grading = t.TypeOf<typeof Grading>;
type AttendanceRef = t.TypeOf<typeof AttendanceRef>;
type EvaluationStatusRef = t.TypeOf<typeof EvaluationStatusRef>;
type TestPointsResult = t.TypeOf<typeof TestPointsResult>;
type TestGradesResult = t.TypeOf<typeof TestGradesResult>;
type UpdatedTestResultResponse = t.TypeOf<typeof UpdatedTestResultResponse>;
type AverageTestResultResponse = t.TypeOf<typeof AverageTestResultResponse>;
export {
  Course,
  Grading,
  AttendanceRef,
  EvaluationStatusRef,
  TestPointsResult,
  UpdatedTestResultResponse,
  TestGradesResult,
  AverageTestResultResponse,
};
