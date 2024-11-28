import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, Observable, of } from "rxjs";
import { LessonStudyClass } from "src/app/shared/models/lesson-study-class.model";
import { TimetableEntry } from "src/app/shared/models/timetable-entry.model";
import { LessonPresencesRestService } from "src/app/shared/services/lesson-presences-rest.service";
import { StudentsRestService } from "src/app/shared/services/students-rest.service";
import { TeachersRestService } from "src/app/shared/services/teachers-rest.service";
import { UserSettingsService } from "src/app/shared/services/user-settings.service";
import {
  buildLessonAbsence,
  buildLessonIncident,
  buildTimetableEntry,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { DashboardService } from "../../services/dashboard.service";
import { DashboardTimetableComponent } from "./dashboard-timetable.component";

/* eslint-disable @typescript-eslint/no-explicit-any */

describe("DashboardTimetableComponent", () => {
  // let component: DashboardTimetableComponent;
  let fixture: ComponentFixture<DashboardTimetableComponent>;
  let element: HTMLElement;
  let teachersServiceMock: jasmine.SpyObj<TeachersRestService>;
  let lessonPresencesServiceMock: jasmine.SpyObj<LessonPresencesRestService>;
  let studentsServiceMock: jasmine.SpyObj<StudentsRestService>;
  let mockSettings: Record<string, any>;
  let dashboardServiceMock: {
    userId$: Observable<number>;
    hasLessonTeacherRole$: BehaviorSubject<boolean>;
    hasStudentRole$: BehaviorSubject<boolean>;
  };

  beforeEach(async () => {
    jasmine.clock().mockDate(new Date(2000, 0, 23));
    mockSettings = {};

    await TestBed.configureTestingModule(
      buildTestModuleMetadata({
        imports: [DashboardTimetableComponent],
        providers: [
          {
            provide: DashboardService,
            useFactory() {
              dashboardServiceMock = {
                userId$: of(123),
                hasLessonTeacherRole$: new BehaviorSubject(false),
                hasStudentRole$: new BehaviorSubject(false),
              };
              return dashboardServiceMock;
            },
          },
          {
            provide: TeachersRestService,
            useFactory() {
              teachersServiceMock = jasmine.createSpyObj(
                "TeachersRestService",
                ["getTimetableEntries"],
              );
              teachersServiceMock.getTimetableEntries.and.returnValue(of([]));
              return teachersServiceMock;
            },
          },
          {
            provide: LessonPresencesRestService,
            useFactory() {
              lessonPresencesServiceMock = jasmine.createSpyObj(
                "LessonPresencesRestService",
                ["getLessonStudyClassesByDate"],
              );
              lessonPresencesServiceMock.getLessonStudyClassesByDate.and.returnValue(
                of([]),
              );
              return lessonPresencesServiceMock;
            },
          },
          {
            provide: StudentsRestService,
            useFactory() {
              studentsServiceMock = jasmine.createSpyObj(
                "StudentsRestService",
                [
                  "getTimetableEntries",
                  "getLessonAbsences",
                  "getLessonIncidents",
                ],
              );
              studentsServiceMock.getTimetableEntries.and.returnValue(of([]));
              studentsServiceMock.getLessonAbsences.and.returnValue(
                of([buildLessonAbsence("1")]),
              );
              studentsServiceMock.getLessonIncidents.and.returnValue(
                of([buildLessonIncident()]),
              );
              return studentsServiceMock;
            },
          },
          {
            provide: UserSettingsService,
            useValue: {
              getSetting(key: string) {
                return of(mockSettings[key] ?? null);
              },
            },
          },
        ],
      }),
    ).compileComponents();

    fixture = TestBed.createComponent(DashboardTimetableComponent);
    // component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
  });

  describe("LessonTeacherRole", () => {
    beforeEach(() => {
      dashboardServiceMock.hasLessonTeacherRole$.next(true);
    });

    it("renders timetable for today", () => {
      const entry1 = buildTimetableEntry(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
      );
      entry1.EventId = 10;
      entry1.EventNumber = "3-1-E-S3-Test-9a";
      entry1.EventDesignation = "Mathematik";
      entry1.EventManagerInformation = "Leonhard Euler";
      entry1.EventLocation = "109";

      const entry2 = buildTimetableEntry(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
      );
      entry2.EventId = 20;
      entry2.EventNumber = "3-2-E-S3-Test-8c";
      entry2.EventDesignation = "Zeichnen";
      entry2.EventManagerInformation = "Pablo Picasso";
      entry2.EventLocation = "502";

      teachersServiceMock.getTimetableEntries.and.returnValue(
        of([entry1, entry2]),
      );
      lessonPresencesServiceMock.getLessonStudyClassesByDate.and.returnValue(
        of([
          buildLessonStudyClass(entry1, "9a"),
          buildLessonStudyClass(entry2, "8c"),
        ]),
      );

      fixture.detectChanges();
      expect(element.textContent).toContain("Sun, 23. January 2000");
      expect(teachersServiceMock.getTimetableEntries).toHaveBeenCalledTimes(1);
      expect(
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[0],
      ).toEqual(123);
      const params =
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[1];
      expect((params as any)["filter.From"]).toEqual("=2000-01-23");
      expect(studentsServiceMock.getTimetableEntries).not.toHaveBeenCalled();

      const rows = element.querySelectorAll("tbody tr");
      expect(rows.length).toBe(2);

      // First row
      expect(rows[0].querySelector("td.time")?.textContent?.trim()).toBe(
        "08:00–09:00",
      );

      let link = rows[0].querySelector("td.subject a");
      expect(link?.textContent?.trim()).toBe("Mathematik, 9a");
      expect(link?.getAttribute("href")).toBe("link-to-event-detail-module/10");

      expect(rows[0].querySelector("td.study-class")?.textContent).toContain(
        "9a",
      ); // Only visible on mobile

      expect(rows[0].querySelector("td.teacher")).toBeNull(); // No teacher column for teachers

      console.log(rows[0].innerHTML);
      expect(rows[0].querySelector("td.room")?.textContent).toContain("109");

      // Second row
      expect(rows[1].querySelector("td.time")?.textContent?.trim()).toBe(
        "09:00–10:00",
      );

      link = rows[1].querySelector("td.subject a");
      expect(link?.textContent?.trim()).toBe("Zeichnen, 8c");
      expect(link?.getAttribute("href")).toBe("link-to-event-detail-module/20");

      expect(rows[1].querySelector("td.study-class")?.textContent).toContain(
        "8c",
      ); // Only visible on mobile

      expect(rows[1].querySelector("td.teacher")).toBeNull(); // No teacher column for teachers

      expect(rows[1].querySelector("td.room")?.textContent).toContain("502");
    });

    it("switches to next day and back to today", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Sun, 23. January 2000");
      teachersServiceMock.getTimetableEntries.calls.reset();

      getNextButton().click();
      fixture.detectChanges();
      expect(element.textContent).toContain("Mon, 24. January 2000");
      expect(teachersServiceMock.getTimetableEntries).toHaveBeenCalledTimes(1);
      expect(
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[0],
      ).toEqual(123);
      let params =
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[1];
      expect((params as any)["filter.From"]).toEqual("=2000-01-24");
      teachersServiceMock.getTimetableEntries.calls.reset();

      getTodayButton().click();
      fixture.detectChanges();
      expect(element.textContent).toContain("Sun, 23. January 2000");
      expect(teachersServiceMock.getTimetableEntries).toHaveBeenCalledTimes(1);
      expect(
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[0],
      ).toEqual(123);
      params =
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[1];
      expect((params as any)["filter.From"]).toEqual("=2000-01-23");
    });

    it("switches to previous day", () => {
      fixture.detectChanges();
      expect(element.textContent).toContain("Sun, 23. January 2000");
      teachersServiceMock.getTimetableEntries.calls.reset();

      getPreviousButton().click();
      fixture.detectChanges();
      expect(element.textContent).toContain("Sat, 22. January 2000");
      expect(teachersServiceMock.getTimetableEntries).toHaveBeenCalledTimes(1);
      expect(
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[0],
      ).toEqual(123);
      const params =
        teachersServiceMock.getTimetableEntries.calls.mostRecent().args[1];
      expect((params as any)["filter.From"]).toEqual("=2000-01-22");
    });

    it("does not render calendar subscribe button without user setting", () => {
      fixture.detectChanges();
      const subscribeButton = document.querySelector(
        ".subscribe-calendar-header",
      );
      expect(subscribeButton).toBeNull();
    });

    it("renders calendar subscribe button with user setting", () => {
      mockSettings["cal"] = "https://subscribe/calendar";
      fixture.detectChanges();

      const subscribeButton = document.querySelector(
        ".subscribe-calendar-header",
      );
      expect(subscribeButton?.textContent?.trim()).toBe(
        "dashboard.timetable.subscribe-calendar",
      );
      expect(subscribeButton?.getAttribute("href")).toBe(
        "https://subscribe/calendar",
      );
    });
  });

  describe("StudentRole", () => {
    beforeEach(() => {
      dashboardServiceMock.hasStudentRole$.next(true);
    });

    it("renders timetable for today", () => {
      const entry1 = buildTimetableEntry(
        1,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
      );
      entry1.EventId = 10;
      entry1.EventDesignation = "Mathematik";
      entry1.EventManagerInformation = "Leonhard Euler";
      entry1.EventLocation = "109";

      const entry2 = buildTimetableEntry(
        2,
        new Date(2000, 0, 23, 9, 0),
        new Date(2000, 0, 23, 10, 0),
      );
      entry2.EventId = 20;
      entry2.EventDesignation = "Zeichnen";
      entry2.EventManagerInformation = "Pablo Picasso";
      entry2.EventLocation = "502";

      studentsServiceMock.getTimetableEntries.and.returnValue(
        of([entry1, entry2]),
      );

      fixture.detectChanges();
      expect(element.textContent).toContain("Sun, 23. January 2000");
      expect(studentsServiceMock.getTimetableEntries).toHaveBeenCalledTimes(1);
      expect(
        studentsServiceMock.getTimetableEntries.calls.mostRecent().args[0],
      ).toEqual(123);
      const params =
        studentsServiceMock.getTimetableEntries.calls.mostRecent().args[1];
      expect((params as any)["filter.From"]).toEqual("=2000-01-23");
      expect(
        lessonPresencesServiceMock.getLessonStudyClassesByDate,
      ).not.toHaveBeenCalled();
      expect(teachersServiceMock.getTimetableEntries).not.toHaveBeenCalled();

      const rows = element.querySelectorAll("tbody tr");
      expect(rows.length).toBe(2);

      // First row
      expect(rows[0].querySelector("td.time")?.textContent?.trim()).toBe(
        "08:00–09:00",
      );

      let label = rows[0].querySelector("td.subject");
      expect(label?.textContent?.trim()).toBe("Mathematik");

      expect(rows[0].querySelector("td.teacher")?.textContent?.trim()).toBe(
        "Leonhard Euler",
      );

      expect(rows[0].querySelector("td.room")?.textContent).toContain("109");

      // Second row
      expect(rows[1].querySelector("td.time")?.textContent?.trim()).toBe(
        "09:00–10:00",
      );

      label = rows[1].querySelector("td.subject");
      expect(label?.textContent?.trim()).toBe("Zeichnen");

      expect(rows[1].querySelector("td.teacher")?.textContent?.trim()).toBe(
        "Pablo Picasso",
      );

      expect(rows[1].querySelector("td.room")?.textContent).toContain("502");
    });
  });

  function getNextButton(): HTMLElement {
    const button = element.querySelector<HTMLElement>(".btn.next-day");
    expect(button).not.toBeNull();
    return button!;
  }

  function getPreviousButton(): HTMLElement {
    const button = element.querySelector<HTMLElement>(".btn.previous-day");
    expect(button).not.toBeNull();
    return button!;
  }

  function getTodayButton(): HTMLElement {
    const button = element.querySelector<HTMLElement>(".btn.today");
    expect(button).not.toBeNull();
    return button!;
  }
});

function buildLessonStudyClass(
  entry: TimetableEntry,
  studyClassNumber: string,
): LessonStudyClass {
  return {
    EventRef: { Id: entry.EventId, HRef: "" },
    LessonRef: { Id: entry.Id, HRef: "" },
    StudyClassNumber: studyClassNumber,
  };
}
