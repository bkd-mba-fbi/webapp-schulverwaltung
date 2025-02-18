import { TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject, map, of } from "rxjs";
import { ReportType } from "src/app/settings";
import { Course } from "src/app/shared/models/course.model";
import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
import { Student } from "src/app/shared/models/student.model";
import { ApprenticeshipContractsRestService } from "src/app/shared/services/apprenticeship-contracts-rest.service";
import { CoursesRestService } from "src/app/shared/services/courses-rest.service";
import { EventsRestService } from "src/app/shared/services/events-rest.service";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { PersonsRestService } from "src/app/shared/services/persons-rest.service";
import { ReportsService } from "src/app/shared/services/reports.service";
import { SubscriptionsRestService } from "src/app/shared/services/subscriptions-rest.service";
import {
  buildCourse,
  buildReference,
  buildStudent,
  buildStudyClass,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  COURSE_TYPE_ID,
  EventsStudentsStateService,
  STUDY_CLASS_TYPE_ID,
  STUDY_COURSE_TYPE_ID,
} from "./events-students-state.service";

const MOCK_REGISTRATION_DATE = new Date("2025-02-05T15:41:25Z");

describe("EventsStudentsStateService", () => {
  let service: EventsStudentsStateService;
  let eventIdSubject: Subject<number>;
  let coursesServiceMock: jasmine.SpyObj<CoursesRestService>;
  let apprenticeshipContractsServiceMock: jasmine.SpyObj<ApprenticeshipContractsRestService>;
  let lessonPresencesServiceMock: jasmine.SpyObj<LessonPresencesRestService>;
  let subscriptionsServiceMock: jasmine.SpyObj<SubscriptionsRestService>;
  let personsServiceMock: jasmine.SpyObj<PersonsRestService>;
  let course: Course;
  let students: Student[];
  let studyClasses: LessonStudyClass[];
  let subscriptionsClass: string;

  beforeEach(() => {
    eventIdSubject = new BehaviorSubject<number>(0);

    const paul = buildStudent(10);
    paul.FullName = "McCartney Paul";
    paul.DisplayEmail = "paul.mccartney@example.com";

    const john = buildStudent(20);
    john.FullName = "Lennon John";
    john.DisplayEmail = "john.lennon@example.com";

    const george = buildStudent(30);
    george.FullName = "Harrison George";
    george.DisplayEmail = "george.harrison@example.com";

    const ringo = buildStudent(40);
    ringo.FullName = "Starr Ringo";
    ringo.DisplayEmail = "ringo.starr@example.com";

    students = [paul, john, george, ringo];

    course = buildCourse(1, "English-S3");
    course.Classes = [buildStudyClass(100, "26a"), buildStudyClass(200, "26c")];
    course.AttendanceRef = buildReference();
    course.ParticipatingStudents = students;

    studyClasses = [
      buildLessonStudyClass(1, paul, "26a"),
      buildLessonStudyClass(1, john, "26a"),
      buildLessonStudyClass(1, george, "26a"),
      buildLessonStudyClass(1, ringo, "26a"),
    ];

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: eventIdSubject.pipe(
                map((id) => new Map<string, string>([["id", String(id)]])),
              ),
            },
          },
          {
            provide: EventsRestService,
            useValue: {
              getEventSummary(eventId: number) {
                let eventTypeId = null;
                let eventDesignation = "";
                switch (eventId) {
                  case 1:
                    eventTypeId = COURSE_TYPE_ID;
                    break;
                  case 2:
                    eventTypeId = STUDY_CLASS_TYPE_ID;
                    break;
                  case 3:
                    eventTypeId = STUDY_COURSE_TYPE_ID;
                    eventDesignation = "Gymnasialer Bildungsgang";
                    break;
                }

                return of(
                  eventTypeId
                    ? {
                        Id: eventId,
                        EventTypeId: eventTypeId,
                        EventType: "",
                        Designation: eventDesignation,
                      }
                    : null,
                );
              },
            },
          },
          {
            provide: CoursesRestService,
            useFactory() {
              coursesServiceMock = jasmine.createSpyObj("CoursesRestService", [
                "getExpandedCourseWithParticipants",
              ]);
              coursesServiceMock.getExpandedCourseWithParticipants.and.returnValue(
                of(course),
              );
              return coursesServiceMock;
            },
          },
          {
            provide: ApprenticeshipContractsRestService,
            useFactory() {
              apprenticeshipContractsServiceMock = jasmine.createSpyObj(
                "ApprenticeshipContractsRestService",
                ["getCompaniesForStudents"],
              );
              apprenticeshipContractsServiceMock.getCompaniesForStudents.and.returnValue(
                of([
                  {
                    Id: 1,
                    StudentId: 10,
                    CompanyName: "Apple Records",
                    CompanyNameAddition: "Abbey Road Studios",
                  },
                ]),
              );
              return apprenticeshipContractsServiceMock;
            },
          },
          {
            provide: LessonPresencesRestService,
            useFactory() {
              lessonPresencesServiceMock = jasmine.createSpyObj(
                "LessonPresencesRestService",
                ["getLessonStudyClassesByEvent"],
              );
              lessonPresencesServiceMock.getLessonStudyClassesByEvent.and.callFake(
                () => of(studyClasses),
              );
              return lessonPresencesServiceMock;
            },
          },
          {
            provide: SubscriptionsRestService,
            useFactory() {
              subscriptionsServiceMock = jasmine.createSpyObj(
                "SubscriptionsRestService",
                ["getSubscriptionsByCourse"],
              );
              subscriptionsServiceMock.getSubscriptionsByCourse.and.callFake(
                (eventId) =>
                  of(
                    students.map(({ Id: studentId }, i) => ({
                      Id: eventId + studentId,
                      EventId: eventId,
                      EventDesignation: subscriptionsClass,
                      PersonId: studentId,
                      Status: i === 0 ? "Angemeldet" : "Aufgenommen",
                      RegistrationDate: MOCK_REGISTRATION_DATE,
                    })),
                  ),
              );
              return subscriptionsServiceMock;
            },
          },
          {
            provide: PersonsRestService,
            useFactory() {
              personsServiceMock = jasmine.createSpyObj("PersonsRestService", [
                "getSummaries",
              ]);
              personsServiceMock.getSummaries.and.callFake((ids) =>
                of(
                  students
                    .filter((s) => ids.includes(s.Id))
                    .map((s) => ({ ...s, Email: null })),
                ),
              );
              return personsServiceMock;
            },
          },
        ],
      }),
    );
    const reportsService = TestBed.inject(ReportsService);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(reportsService as any, "getAvailableReportsForType").and.callFake(
      (
        reportType: ReportType,
        context: string,
        reportIds: ReadonlyArray<number>,
        recordIds: ReadonlyArray<number | string>,
      ) => {
        return of(
          reportIds.map((reportId) => ({
            type: reportType,
            id: reportId,
            title: `Report ${reportType} ${reportId}`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            url: (reportsService as any).getReportUrl(
              reportType,
              context,
              reportId,
              recordIds,
            ),
          })),
        );
      },
    );

    service = TestBed.inject(EventsStudentsStateService);
  });

  describe("course", () => {
    beforeEach(() => {
      studyClasses[2].StudyClassNumber = "26c";
      studyClasses[3].StudyClassNumber = "26c";

      eventIdSubject.next(1);
      TestBed.flushEffects();
    });

    describe("isStudyCourse", () => {
      it("is false", () => {
        expect(service.isStudyCourse()).toBe(false);
      });
    });

    describe("title", () => {
      it("contains the course designation and the participating classes", () => {
        expect(service.title()).toBe("English-S3, 26a, 26c");
      });
    });

    describe("multipleStudyClasses", () => {
      it("is false for course with only one class", () => {
        course.Classes = [buildStudyClass(100, "26a")];
        studyClasses.forEach(
          (studyClass) => (studyClass.StudyClassNumber = "26a"),
        );
        eventIdSubject.next(1);

        expect(service.multipleStudyClasses()).toBe(false);
      });

      it("is true for course with multiple classes", () => {
        expect(service.multipleStudyClasses()).toBe(true);
      });
    });

    describe("entries sort & search", () => {
      it("returns all entries per default", () => {
        const expected = [
          {
            id: 10,
            name: "McCartney Paul",
            email: "paul.mccartney@example.com",
            studyClass: "26a",
            company: "Apple Records – Abbey Road Studios",
          },
          {
            id: 20,
            name: "Lennon John",
            email: "john.lennon@example.com",
            studyClass: "26a",
            company: undefined,
          },
          {
            id: 30,
            name: "Harrison George",
            email: "george.harrison@example.com",
            studyClass: "26c",
            company: undefined,
          },
          {
            id: 40,
            name: "Starr Ringo",
            email: "ringo.starr@example.com",
            studyClass: "26c",
            company: undefined,
          },
        ];

        expect(service.entries()).toEqual(expected);
        expect(service.sortedEntries()).toEqual(
          expected.sort((a, b) => a.name.localeCompare(b.name)),
        );
        expect(service.filteredEntries()).toEqual(
          expected.sort((a, b) => a.name.localeCompare(b.name)),
        );
      });

      it("returns filtered entries for matching firstname", () => {
        service.searchTerm.set("pau");
        TestBed.flushEffects();

        const entries = service.sortedEntries().map(({ name }) => name);
        expect(entries).toEqual([
          "Harrison George",
          "Lennon John",
          "McCartney Paul",
          "Starr Ringo",
        ]);

        const filtered = service.filteredEntries().map(({ name }) => name);
        expect(filtered).toEqual(["McCartney Paul"]);
      });

      it("returns filtered entries for matching lastname", () => {
        service.searchTerm.set("ar");
        TestBed.flushEffects();

        const entries = service.sortedEntries().map(({ name }) => name);
        expect(entries).toEqual([
          "Harrison George",
          "Lennon John",
          "McCartney Paul",
          "Starr Ringo",
        ]);

        const filtered = service.filteredEntries().map(({ name }) => name);
        expect(filtered).toEqual([
          "Harrison George",
          "McCartney Paul",
          "Starr Ringo",
        ]);
      });

      it("returns filtered entries for matching company", () => {
        service.searchTerm.set("abbey");
        TestBed.flushEffects();

        const entries = service.sortedEntries().map(({ name }) => name);
        expect(entries).toEqual([
          "Harrison George",
          "Lennon John",
          "McCartney Paul",
          "Starr Ringo",
        ]);

        const filtered = service.filteredEntries().map(({ name }) => name);
        expect(filtered).toEqual(["McCartney Paul"]);
      });

      it("returns filtered entries for matching class", () => {
        service.searchTerm.set("26c");
        TestBed.flushEffects();

        const entries = service.sortedEntries().map(({ name }) => name);
        expect(entries).toEqual([
          "Harrison George",
          "Lennon John",
          "McCartney Paul",
          "Starr Ringo",
        ]);

        const filtered = service.filteredEntries().map(({ name }) => name);
        expect(filtered).toEqual(["Harrison George", "Starr Ringo"]);
      });
    });

    describe("mailtoLink", () => {
      it("is the mailto: link value with all email addresses comma-separated", () => {
        expect(service.mailtoLink()).toBe(
          "mailto:paul.mccartney@example.com;john.lennon@example.com;george.harrison@example.com;ringo.starr@example.com",
        );
      });
    });

    describe("reports", () => {
      it("is an array of the relevant reports", () => {
        expect(service.reports().length).toBe(5);
      });
    });
  });

  describe("study class", () => {
    beforeEach(() => {
      subscriptionsClass = "26a";
      eventIdSubject.next(2);
      TestBed.flushEffects();
    });

    describe("isStudyCourse", () => {
      it("is false", () => {
        expect(service.isStudyCourse()).toBe(false);
      });
    });

    describe("title", () => {
      it("contains the study class designation", () => {
        expect(service.title()).toBe("26a");
      });
    });

    describe("multipleStudyClasses", () => {
      it("is false", () => {
        expect(service.multipleStudyClasses()).toBe(false);
      });
    });

    describe("entries sort & search", () => {
      it("returns all entries per default", () => {
        const expected = [
          {
            id: 10,
            subscriptionId: 12,
            name: "McCartney Paul",
            email: "paul.mccartney@example.com",
            status: "Angemeldet",
            company: "Apple Records – Abbey Road Studios",
            registrationDate: MOCK_REGISTRATION_DATE,
          },
          {
            id: 20,
            subscriptionId: 22,
            name: "Lennon John",
            email: "john.lennon@example.com",
            status: "Aufgenommen",
            company: undefined,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
          {
            id: 30,
            subscriptionId: 32,
            name: "Harrison George",
            email: "george.harrison@example.com",
            status: "Aufgenommen",
            company: undefined,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
          {
            id: 40,
            subscriptionId: 42,
            name: "Starr Ringo",
            email: "ringo.starr@example.com",
            status: "Aufgenommen",
            company: undefined,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
        ];

        expect(service.entries()).toEqual(expected);
        expect(service.sortedEntries()).toEqual(
          expected.sort((a, b) => a.name.localeCompare(b.name)),
        );
        expect(service.filteredEntries()).toEqual(
          expected.sort((a, b) => a.name.localeCompare(b.name)),
        );
      });
    });

    describe("mailtoLink", () => {
      it("is the mailto: link value with all email addresses comma-separated", () => {
        expect(service.mailtoLink()).toBe(
          "mailto:paul.mccartney@example.com;john.lennon@example.com;george.harrison@example.com;ringo.starr@example.com",
        );
      });
    });

    describe("reports", () => {
      it("is an array of the relevant reports", () => {
        expect(service.reports().length).toBe(3);
      });
    });
  });

  describe("study course", () => {
    beforeEach(() => {
      subscriptionsClass = "Gymnasialer Bildungsgang";
      eventIdSubject.next(3);
      TestBed.flushEffects();
    });

    describe("isStudyCourse", () => {
      it("is true", () => {
        expect(service.isStudyCourse()).toBe(true);
      });
    });

    describe("title", () => {
      it("contains the study class designation", () => {
        expect(service.title()).toBe("Gymnasialer Bildungsgang");
      });
    });

    describe("multipleStudyClasses", () => {
      it("is false", () => {
        expect(service.multipleStudyClasses()).toBe(false);
      });
    });

    describe("entries sort & search", () => {
      it("returns all entries per default", () => {
        const expected = [
          {
            id: 10,
            name: "McCartney Paul",
            email: "paul.mccartney@example.com",
            status: "Angemeldet",
            subscriptionId: 13,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
          {
            id: 20,
            name: "Lennon John",
            email: "john.lennon@example.com",
            status: "Aufgenommen",
            subscriptionId: 23,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
          {
            id: 30,
            name: "Harrison George",
            email: "george.harrison@example.com",
            status: "Aufgenommen",
            subscriptionId: 33,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
          {
            id: 40,
            name: "Starr Ringo",
            email: "ringo.starr@example.com",
            status: "Aufgenommen",
            subscriptionId: 43,
            registrationDate: MOCK_REGISTRATION_DATE,
          },
        ];

        expect(service.entries()).toEqual(expected);
        expect(service.sortedEntries()).toEqual(
          expected.sort((a, b) => a.name.localeCompare(b.name)),
        );
        expect(service.filteredEntries()).toEqual(
          expected.sort((a, b) => a.name.localeCompare(b.name)),
        );
      });

      it("sorts by name ascending", () => {
        service.sortCriteria.set({ primarySortKey: "name", ascending: true });
        expect(service.sortedEntries().map(({ name }) => name)).toEqual([
          "Harrison George",
          "Lennon John",
          "McCartney Paul",
          "Starr Ringo",
        ]);
      });

      it("sorts by name descending", () => {
        service.sortCriteria.set({
          primarySortKey: "name",
          ascending: false,
        });
        expect(service.sortedEntries().map(({ name }) => name)).toEqual([
          "Starr Ringo",
          "McCartney Paul",
          "Lennon John",
          "Harrison George",
        ]);
      });

      it("sorts by registration date ascending and then descending", () => {
        const date1 = new Date("2023-07-22T15:41:25Z");
        const date2 = new Date("2024-11-05T15:41:25Z");
        const date3 = new Date("2025-01-21T15:41:25Z");
        const date4 = new Date("2025-01-21T15:41:25Z");

        subscriptionsServiceMock.getSubscriptionsByCourse.and.callFake(
          (eventId) =>
            of([
              {
                Id: eventId + 10,
                name: "McCartney Paul",
                EventId: eventId,
                EventDesignation: subscriptionsClass,
                PersonId: 10,
                Status: "Angemeldet",
                RegistrationDate: date4,
              },
              {
                Id: eventId + 20,
                name: "Lennon John",
                EventId: eventId,
                EventDesignation: subscriptionsClass,
                PersonId: 20,
                Status: "Aufgenommen",
                RegistrationDate: date1,
              },
              {
                Id: eventId + 30,
                name: "Harrison George",
                EventId: eventId,
                EventDesignation: subscriptionsClass,
                PersonId: 30,
                Status: "Aufgenommen",
                RegistrationDate: date3,
              },
              {
                Id: eventId + 40,
                name: "Starr Ringo",
                EventId: eventId,
                EventDesignation: subscriptionsClass,
                PersonId: 40,
                Status: "Aufgenommen",
                RegistrationDate: date2,
              },
            ]),
        );
        service.sortCriteria.set({
          primarySortKey: "registrationDate",
          ascending: true,
        });
        expect(
          service
            .sortedEntries()
            .map(({ registrationDate }) => registrationDate),
        ).toEqual([date1, date2, date3, date4]);

        service.sortCriteria.set({
          primarySortKey: "registrationDate",
          ascending: false,
        });
        expect(
          service
            .sortedEntries()
            .map(({ registrationDate }) => registrationDate),
        ).toEqual([date4, date3, date2, date1]);
      });
    });

    describe("mailtoLink", () => {
      it("is null", () => {
        expect(service.mailtoLink()).toBeNull();
      });
    });

    describe("reports", () => {
      it("is an empty array", () => {
        expect(service.reports()).toEqual([]);
      });
    });
  });

  function buildLessonStudyClass(
    eventId: number,
    student: Student,
    studyClass: string,
  ): LessonStudyClass {
    return {
      LessonRef: buildReference(),
      EventRef: buildReference(eventId),
      StudentRef: buildReference(student.Id),
      StudyClassNumber: studyClass,
    };
  }
});
