import { StudentCompany } from "src/app/shared/models/apprenticeship-contract.model";
import { Course } from "src/app/shared/models/course.model";
import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
import { StudentSummary } from "../../shared/models/student.model";
import { Subscription } from "../../shared/models/subscription.model";
import {
  StudentEntries,
  StudentEntry,
} from "../services/events-students-state.service";

export function getEventsStudentsLink(
  eventId: number,
  returnLink?: string,
): string {
  const query = new URLSearchParams(
    returnLink ? { returnlink: returnLink } : {},
  );
  return `/events/students/${eventId}?${query}`;
}

export function convertCourseToStudentEntries(course: Course): StudentEntries {
  const entries =
    course.ParticipatingStudents?.map(
      (student) =>
        ({
          id: student.Id,
          firstName: student.FirstName,
          lastName: student.LastName,
          email: student.DisplayEmail ?? undefined,
        }) satisfies StudentEntry,
    ) ?? [];
  return {
    eventId: course.Id,
    eventDesignation: course.Designation,
    studyClasses: (course.Classes ?? []).map((c) => c.Designation).sort(),
    entries,
  };
}

export function decorateCourseStudentsWithCompanies(
  students: StudentEntries,
  companies: ReadonlyArray<StudentCompany>,
): StudentEntries {
  return {
    ...students,
    entries: students.entries.map((student) => {
      const company = companies.find((c) => c.StudentId === student.id);
      const companyName = company
        ? [company.CompanyName, company.CompanyNameAddition]
            .filter(Boolean)
            .join(" – ")
        : undefined;
      return {
        ...student,
        company: companyName,
      } satisfies StudentEntry;
    }),
  };
}

export function convertStudentsToStudentEntries(
  eventId: number,
  students: ReadonlyArray<StudentSummary>,
  subscriptions: ReadonlyArray<Subscription>,
): StudentEntries {
  return {
    eventId: eventId,
    eventDesignation: subscriptions[0]?.EventDesignation ?? "",
    studyClasses: [],
    entries: students.map(
      (student) =>
        ({
          id: student.Id,
          firstName: student.FirstName,
          lastName: student.LastName,
          email: student.DisplayEmail ?? undefined,
          status: subscriptions.find((s) => s.PersonId === student.Id)?.Status,
        }) satisfies StudentEntry,
    ),
  };
}

export function decorateStudyClasses(
  students: StudentEntries,
  lessonStudyClasses: ReadonlyArray<LessonStudyClass>,
): StudentEntries {
  return {
    ...students,
    entries: students.entries.map(
      (student) =>
        ({
          ...student,
          studyClass: lessonStudyClasses.find(
            (c) => c.StudentRef.Id === student.id,
          )?.StudyClassNumber,
        }) satisfies StudentEntry,
    ),
  };
  return students;
}
