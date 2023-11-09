import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { addHours, subHours } from "date-fns";
import { of } from "rxjs";
import { StorageService } from "src/app/shared/services/storage.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import {
  buildLessonAbsence,
  buildLessonDispensation,
  buildLessonPresenceFromTimetableEntry,
  buildPayLoad,
  buildTimetableEntry,
} from "../../../spec-builders";
import { TimetableEntry } from "../../shared/models/timetable-entry.model";
import { StudentsRestService } from "../../shared/services/students-rest.service";
import { MyAbsencesReportStateService } from "./my-absences-report-state.service";

describe("MyAbsencesReportStateService", () => {
  let service: MyAbsencesReportStateService;
  let entriesCallback: jasmine.Spy;
  let storageMock: jasmine.SpyObj<StorageService>;

  let beforeLessonStart: TimetableEntry;
  let onLessonStart: TimetableEntry;
  let afterLessonStart: TimetableEntry;
  let now: Date;

  beforeEach(() => {
    storageMock = jasmine.createSpyObj("StorageService", ["getPayload"]);

    now = new Date();
    const oneHourAgo = subHours(now, 1);
    const twoHoursAgo = subHours(now, 2);
    const oneHourFromNow = addHours(now, 1);
    const twoHoursFromNow = addHours(now, 2);

    beforeLessonStart = buildTimetableEntry(1, twoHoursAgo, oneHourAgo);
    onLessonStart = buildTimetableEntry(2, oneHourAgo, oneHourFromNow);
    afterLessonStart = buildTimetableEntry(3, oneHourFromNow, twoHoursFromNow);

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          MyAbsencesReportStateService,
          {
            provide: StorageService,
            useValue: storageMock,
          },
          {
            provide: StudentsRestService,
            useValue: {
              getTimetableEntries() {
                return of([beforeLessonStart, onLessonStart, afterLessonStart]);
              },
              getLessonAbsences() {
                return of([buildLessonAbsence("1")]);
              },
              getLessonDispensations() {
                return of([buildLessonDispensation("1")]);
              },
            },
          },
        ],
      }),
    );
  });

  describe("with instance GymHofwil", () => {
    it("should return all entries", fakeAsync(() => {
      initializeServiceWithInstance("GymHofwil");

      service.setFilter({ dateFrom: now, dateTo: now });
      tick(10);

      expect(entriesCallback.calls.mostRecent().args[0]).toEqual([
        buildLessonPresenceFromTimetableEntry(beforeLessonStart),
        buildLessonPresenceFromTimetableEntry(onLessonStart),
        buildLessonPresenceFromTimetableEntry(afterLessonStart),
      ]);
    }));
  });

  describe("with instance BsTest", () => {
    it("should only return entries starting after lesson start", fakeAsync(() => {
      initializeServiceWithInstance("BsTest");

      service.setFilter({ dateFrom: now, dateTo: now });
      tick(10);

      expect(entriesCallback.calls.mostRecent().args[0]).toEqual([
        buildLessonPresenceFromTimetableEntry(afterLessonStart),
      ]);
    }));
  });

  function initializeServiceWithInstance(instance: string) {
    storageMock.getPayload.and.returnValue(buildPayLoad("42", instance));
    service = TestBed.inject(MyAbsencesReportStateService);
    entriesCallback = jasmine.createSpy("entries$ callback");
    service.entries$.subscribe(entriesCallback);
  }
});
