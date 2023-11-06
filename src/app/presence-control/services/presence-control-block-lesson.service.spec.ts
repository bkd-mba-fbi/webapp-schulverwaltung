import { HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { format } from "date-fns";
import * as t from "io-ts";
import { of } from "rxjs";
import { LessonPresence } from "src/app/shared/models/lesson-presence.model";
import { Lesson } from "src/app/shared/models/lesson.model";
import {
  buildLessonPresence,
  buildPresenceControlEntry,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { PresenceControlBlockLessonService } from "./presence-control-block-lesson.service";
import { PresenceControlStateService } from "./presence-control-state.service";

describe("PresenceControlBlockLessonService", () => {
  let service: PresenceControlBlockLessonService;
  let httpTestingController: HttpTestingController;
  let stateMock: PresenceControlStateService;

  let mathEinstein1: LessonPresence;
  let mathEinstein2: LessonPresence;
  let mathEinstein3: LessonPresence;
  let mathEinstein4: LessonPresence;
  let lessonPresences: LessonPresence[];
  let lessons: Lesson[];

  beforeEach(() => {
    mathEinstein1 = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 9, 0),
      new Date(2000, 0, 23, 10, 0),
      "Mathematik",
      "Einstein Albert",
      "Martina Moser",
      undefined,
      undefined,
      42,
    );
    mathEinstein2 = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 10, 0),
      new Date(2000, 0, 23, 11, 0),
      "Mathematik",
      "Einstein Albert",
      "Martina Moser",
      undefined,
      undefined,
      42,
    );
    mathEinstein3 = buildLessonPresence(
      3,
      new Date(2000, 0, 23, 11, 0),
      new Date(2000, 0, 23, 12, 0),
      "Mathematik",
      "Einstein Albert",
      "Martina Moser",
      undefined,
      undefined,
      42,
    );
    mathEinstein4 = buildLessonPresence(
      4,
      new Date(2000, 0, 23, 13, 0),
      new Date(2000, 0, 23, 14, 0),
      "Mathematik",
      "Einstein Albert",
      "Martina Moser",
      undefined,
      undefined,
      42,
    );
    lessonPresences = [
      mathEinstein1,
      mathEinstein2,
      mathEinstein3,
      mathEinstein4,
    ];
    lessons = lessonsFromPresences(lessonPresences);

    stateMock = {
      lessons$: of(lessons),
      presenceTypes$: of([]),
      absenceConfirmationStates$: of([]),
      otherTeachersAbsences$: of([]),
    } as unknown as PresenceControlStateService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          PresenceControlBlockLessonService,
          { provide: PresenceControlStateService, useValue: stateMock },
        ],
      }),
    );
    service = TestBed.inject(PresenceControlBlockLessonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe(".getBlockLessonPresenceControlEntries", () => {
    it("returns all block lessons related to the given entry", (done) => {
      service
        .getBlockLessonPresenceControlEntries(
          buildPresenceControlEntry(mathEinstein1),
        )
        .subscribe((result) => {
          expect(result).toEqual([
            buildPresenceControlEntry(mathEinstein1),
            buildPresenceControlEntry(mathEinstein2),
            buildPresenceControlEntry(mathEinstein3),
          ]);
          done();
        });

      expectLessonPresencesRequest(
        lessonPresences[0].LessonDateTimeFrom,
        lessonPresences[0].StudentRef.Id,
        lessonPresences[0].StudyClassRef.Id ?? undefined,
      );
    });

    it("returns a single lesson if the given entry is not part of a block lesson", (done) => {
      service
        .getBlockLessonPresenceControlEntries(
          buildPresenceControlEntry(mathEinstein4),
        )
        .subscribe((result) => {
          expect(result).toEqual([buildPresenceControlEntry(mathEinstein4)]);
          done();
        });

      expectLessonPresencesRequest(
        lessonPresences[0].LessonDateTimeFrom,
        lessonPresences[0].StudentRef.Id,
        lessonPresences[0].StudyClassRef.Id ?? undefined,
      );
    });
  });

  function expectLessonPresencesRequest(
    date: Date,
    studentId: number,
    studyClassId?: number,
    response = lessonPresences,
  ): void {
    const url = `https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==${format(
      date,
      "yyyy-MM-dd",
    )}&filter.StudentRef==${studentId}&filter.StudyClassRef==${studyClassId}`;

    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(t.array(LessonPresence).encode(response));
  }

  function lessonsFromPresences(presences: LessonPresence[]): Lesson[] {
    return presences.map((p) =>
      Object.keys(Lesson.props).reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj, key) => ({ ...obj, [key]: (p as any)[key] }),
        {} as Lesson,
      ),
    );
  }
});
