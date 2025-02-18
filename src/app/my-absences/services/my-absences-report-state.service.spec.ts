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

    service = TestBed.inject(MyAbsencesReportStateService);
    entriesCallback = jasmine.createSpy("entries$ callback");
  });

  describe("with instance GymHofwil", () => {
    beforeEach(() => {
      storageMock.getPayload.and.returnValue(buildPayLoad("42", "GymHofwil"));
    });

    it("returns all entries", fakeAsync(() => {
      service.entries$.subscribe(entriesCallback);

      service.setFilter({ dateFrom: now, dateTo: now });
      TestBed.flushEffects();
      tick(1000);

      expect(entriesCallback.calls.mostRecent()?.args[0]).toEqual([
        buildLessonPresenceFromTimetableEntry(beforeLessonStart),
        buildLessonPresenceFromTimetableEntry(onLessonStart),
        buildLessonPresenceFromTimetableEntry(afterLessonStart),
      ]);
    }));
  });

  describe("with instance BsTest", () => {
    beforeEach(() => {
      storageMock.getPayload.and.returnValue(buildPayLoad("42", "BsTest"));
    });

    // Skip this test for now, since it is flaky and we have no clue how to fix
    // it. Locally it works most of the time, in CI it seems to fail more often.
    // Apparently it is no problem of call order, but rather in some cases,
    // entries$ does not emit any value.
    xit("only returns entries starting after lesson start", fakeAsync(() => {
      service.entries$.subscribe(entriesCallback);

      service.setFilter({ dateFrom: now, dateTo: now });
      TestBed.flushEffects();
      tick(1000);

      expect(entriesCallback.calls.mostRecent()?.args[0]).toEqual([
        buildLessonPresenceFromTimetableEntry(afterLessonStart),
      ]);
    }));
  });
});
