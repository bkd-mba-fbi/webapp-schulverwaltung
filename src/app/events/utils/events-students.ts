import { StudentCompany } from "src/app/shared/models/apprenticeship-contract.model";
import { Course } from "src/app/shared/models/course.model";
import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
import { PersonSummary } from "src/app/shared/models/person.model";
import { Subscription } from "../../shared/models/subscription.model";
import {
  StudentEntries,
  StudentEntry,
} from "../services/events-students-state.service";

export function getEventsStudentsLink(
  eventId: number,
  returnLink: string,
): string {
  const query = new URLSearchParams({ returnlink: returnLink });
  if (returnLink.startsWith("/dashboard")) {
    return `/dashboard/students/${eventId}?${query}`;
  } else if (returnLink.startsWith("/events/current")) {
    return `/events/current/${eventId}?${query}`;
  }
  return `/events/${eventId}/students?${query}`;
}

export function convertCourseToStudentEntries(course: Course): StudentEntries {
  const entries =
    course.Participants?.filter((s) => s.IsActive).map(
      (student) =>
        ({
          id: student.PersonId,
          name: student.FullName,
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

export function convertPersonsToStudentEntries(
  eventId: number,
  persons: ReadonlyArray<PersonSummary>,
  subscriptions: ReadonlyArray<Subscription>,
  { eventDesignation }: { eventDesignation?: string } = {},
): StudentEntries {
  return {
    eventId: eventId,
    eventDesignation:
      eventDesignation ?? subscriptions[0]?.EventDesignation ?? "",
    studyClasses: [],
    entries: persons.map((person) => {
      const subscription = subscriptions.find((s) => s.PersonId === person.Id);
      return {
        id: person.Id,
        subscriptionId: subscription?.Id,
        name: person.FullName,
        email: person.DisplayEmail ?? undefined,
        status: subscription?.Status,
        registrationDate: subscription?.RegistrationDate ?? undefined,
      } satisfies StudentEntry;
    }),
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
}
