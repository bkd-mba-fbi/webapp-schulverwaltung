import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { MyAbsencesReportStateService } from "./my-absences-report-state.service";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { StorageService } from "src/app/shared/services/storage.service";
import { StudentsRestService } from "../../shared/services/students-rest.service";
import { of } from "rxjs";
import { TimetableEntry } from "../../shared/models/timetable-entry.model";
import {
  buildLessonAbsence,
  buildLessonDispensation,
  buildLessonPresenceFromTimetableEntry,
  buildPayLoad,
  buildTimetableEntry,
} from "../../../spec-builders";
import { addHours, subHours } from "date-fns";

describe("MyAbsencesReportStateService", () => {
  let service: MyAbsencesReportStateService;
  let entriesCallback: jasmine.Spy;
  const storageMock: jasmine.SpyObj<StorageService> = jasmine.createSpyObj(
    "StorageService",
    ["getPayload"],
  );

  let beforeLessonStart: TimetableEntry;
  let onLessonStart: TimetableEntry;
  let afterLessonStart: TimetableEntry;

  beforeEach(() => {
    beforeLessonStart = buildTimetableEntry(
      1,
      subHours(new Date(), 2),
      subHours(new Date(), 1),
    );
    onLessonStart = buildTimetableEntry(
      2,
      subHours(new Date(), 1),
      addHours(new Date(), 1),
    );
    afterLessonStart = buildTimetableEntry(
      3,
      addHours(new Date(), 1),
      addHours(new Date(), 2),
    );

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

      service.setFilter({ dateFrom: new Date(), dateTo: new Date() });
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

      service.setFilter({ dateFrom: new Date(), dateTo: new Date() });
      tick(1000);

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
