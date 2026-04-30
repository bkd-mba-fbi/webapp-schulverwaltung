import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Subject, of, throwError } from "rxjs";
import {
  buildLessonPresence,
  buildPresenceControlEntry,
  buildPresenceType,
  buildReference,
} from "src/spec-builders";
import { buildTestModuleMetadata } from "src/spec-helpers";
import { PresenceControlEntry } from "../../presence-control/models/presence-control-entry.model";
import { LessonPresence } from "../models/lesson-presence.model";
import { PresenceType } from "../models/presence-type.model";
import { LessonPresencesUpdateRestService } from "./lesson-presences-update-rest.service";
import {
  LessonPresencesUpdateService,
  getEntryUpdateContext,
} from "./lesson-presences-update.service";
import { LoadingService } from "./loading-service";
import { PresenceTypesService } from "./presence-types.service";

describe("LessonPresencesUpdateService", () => {
  let service: LessonPresencesUpdateService;
  let loadingService: LoadingService;
  let restServiceMock: LessonPresencesUpdateRestService;
  let presenceTypeServiceMock: PresenceTypesService;

  let absent: PresenceType;

  let turnenFrisch: LessonPresence;
  let deutschFrisch: LessonPresence;
  let deutschFrisch2: LessonPresence;
  let deutschWalser: LessonPresence;

  let editResult$: Subject<void>;
  let removeResult$: Subject<void>;

  beforeEach(() => {
    absent = buildPresenceType(11, true, false);

    editResult$ = new Subject<void>();
    removeResult$ = new Subject<void>();

    restServiceMock = {
      editLessonPresences: jasmine
        .createSpy("editLessonPresences")
        .and.callFake(() => editResult$),
      removeLessonPresences: jasmine
        .createSpy("removeLessonPresences")
        .and.callFake(() => removeResult$),
    } as unknown as LessonPresencesUpdateRestService;

    presenceTypeServiceMock = {
      getPresenceType: jasmine
        .createSpy("getPresenceType")
        .withArgs(absent.Id)
        .and.callFake(() => of(absent)),
    } as unknown as PresenceTypesService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: LessonPresencesUpdateRestService,
            useValue: restServiceMock,
          },
          { provide: PresenceTypesService, useValue: presenceTypeServiceMock },
        ],
      }),
    );
    service = TestBed.inject(LessonPresencesUpdateService);
    loadingService = TestBed.inject(LoadingService);

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      "Turnen",
      "Frisch Max",
      "Hans Lehmann",
    );
    turnenFrisch.StudentRef = buildReference(10);

    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      "Deutsch",
      "Frisch Max",
      "Dora Durrer",
    );
    deutschFrisch.StudentRef = buildReference(10);

    deutschFrisch2 = buildLessonPresence(
      3,
      new Date(2000, 0, 23, 9, 0),
      new Date(2000, 0, 23, 10, 0),
      "Deutsch",
      "Frisch Max",
      "Dora Durrer",
    );
    deutschFrisch2.StudentRef = buildReference(10);

    deutschWalser = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      "Deutsch",
      "Walser Robert",
      "Dora Durrer",
    );
    deutschWalser.StudentRef = buildReference(20);
  });

  describe(".updatePresenceType", () => {
    describe("single lesson entry", () => {
      let entry: PresenceControlEntry;

      beforeEach(() => {
        entry = buildPresenceControlEntry(turnenFrisch);
      });

      it("creates absence and emits the update on success while updating the entry's loading state", fakeAsync(() => {
        const resultCallback = jasmine.createSpy("result");
        let loading: Option<boolean> = null;
        loadingService
          .loading(getEntryUpdateContext(entry))
          .subscribe((value) => (loading = value));

        service.updatePresenceType(entry, absent.Id).subscribe(resultCallback);

        expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
          [1],
          [10],
          absent.Id,
          219,
        );
        expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
        expect(loading).toBeTrue();
        expect(resultCallback).not.toHaveBeenCalled();

        editResult$.next();
        editResult$.complete();
        tick();

        expect(resultCallback).toHaveBeenCalledWith([
          {
            presence: turnenFrisch,
            newPresenceTypeId: absent.Id,
          },
        ]);
        expect(loading).toBeFalse();
      }));

      it('removes absence if newPresenceTypeId is null (set to "present")', fakeAsync(() => {
        entry.presenceType = absent;
        entry.lessonPresence.TypeRef = buildReference(absent.Id);
        const resultCallback = jasmine.createSpy("result");

        service.updatePresenceType(entry, null).subscribe(resultCallback);

        expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
        expect(restServiceMock.removeLessonPresences).toHaveBeenCalledWith(
          [1],
          [10],
        );

        removeResult$.next();
        removeResult$.complete();
        tick();

        expect(resultCallback).toHaveBeenCalledWith([
          {
            presence: turnenFrisch,
            newPresenceTypeId: null,
          },
        ]);
      }));

      it("does not emit a value and clears the loading state when the request fails", fakeAsync(() => {
        (restServiceMock.editLessonPresences as jasmine.Spy).and.returnValue(
          throwError(() => new Error("dummy error")),
        );

        const resultCallback = jasmine.createSpy("result");
        const errorCallback = jasmine.createSpy("error");
        let loading: Option<boolean> = null;
        loadingService
          .loading(getEntryUpdateContext(entry))
          .subscribe((value) => (loading = value));

        service
          .updatePresenceType(entry, absent.Id)
          .subscribe({ next: resultCallback, error: errorCallback });
        tick();

        expect(resultCallback).not.toHaveBeenCalled();
        // Errors are propagated; the global REST error interceptor is responsible
        // for handling them (toast & swallow) in production.
        expect(errorCallback).toHaveBeenCalled();
        expect(loading).toBeFalse();
      }));
    });

    describe("block lesson", () => {
      let entry1: PresenceControlEntry;
      let entry2: PresenceControlEntry;

      beforeEach(() => {
        entry1 = buildPresenceControlEntry(deutschFrisch);
        entry2 = buildPresenceControlEntry(deutschFrisch2);
      });

      it("creates absence and emits the update on success while updating the entry's loading state", fakeAsync(() => {
        const resultCallback = jasmine.createSpy("result");
        let loading1: Option<boolean> = null;
        let loading2: Option<boolean> = null;
        loadingService
          .loading(getEntryUpdateContext(entry1))
          .subscribe((value) => (loading1 = value));
        loadingService
          .loading(getEntryUpdateContext(entry2))
          .subscribe((value) => (loading2 = value));

        service
          .updatePresenceType([entry1, entry2], absent.Id)
          .subscribe(resultCallback);

        expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
          [2, 3],
          [10],
          absent.Id,
          219,
        );
        expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
        expect(loading1).toBeTrue();
        expect(loading2).toBeTrue();
        expect(resultCallback).not.toHaveBeenCalled();

        editResult$.next();
        editResult$.complete();
        tick();

        expect(resultCallback).toHaveBeenCalledWith([
          {
            presence: deutschFrisch,
            newPresenceTypeId: absent.Id,
          },
          {
            presence: deutschFrisch2,
            newPresenceTypeId: absent.Id,
          },
        ]);
        expect(loading1).toBeFalse();
        expect(loading2).toBeFalse();
      }));

      it('removes absence if newPresenceTypeId is null (set to "present")', fakeAsync(() => {
        entry1.presenceType = absent;
        entry1.lessonPresence.TypeRef = buildReference(absent.Id);
        entry2.presenceType = absent;
        entry2.lessonPresence.TypeRef = buildReference(absent.Id);
        const resultCallback = jasmine.createSpy("result");

        service
          .updatePresenceType([entry1, entry2], null)
          .subscribe(resultCallback);

        expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
        expect(restServiceMock.removeLessonPresences).toHaveBeenCalledWith(
          [2, 3],
          [10],
        );

        removeResult$.next();
        removeResult$.complete();
        tick();

        expect(resultCallback).toHaveBeenCalledWith([
          {
            presence: deutschFrisch,
            newPresenceTypeId: null,
          },
          {
            presence: deutschFrisch2,
            newPresenceTypeId: null,
          },
        ]);
      }));

      it("throws an error if entries don't have the same presence type", fakeAsync(() => {
        (restServiceMock.editLessonPresences as jasmine.Spy).and.returnValue(
          throwError(() => new Error("dummy error")),
        );
        entry1.presenceType = absent;
        entry1.lessonPresence.TypeRef = buildReference(absent.Id);
        const resultCallback = jasmine.createSpy("result");
        const errorCallback = jasmine.createSpy("error");

        let loading1: Option<boolean> = null;
        let loading2: Option<boolean> = null;
        loadingService
          .loading(getEntryUpdateContext(entry1))
          .subscribe((value) => (loading1 = value));
        loadingService
          .loading(getEntryUpdateContext(entry2))
          .subscribe((value) => (loading2 = value));

        service
          .updatePresenceType([entry1, entry2], absent.Id)
          .subscribe({ next: resultCallback, error: errorCallback });
        tick();

        expect(resultCallback).not.toHaveBeenCalled();
        // Errors are propagated; the global REST error interceptor is responsible
        // for handling them (toast & swallow) in production.
        expect(errorCallback).toHaveBeenCalled();
        expect(loading1).toBeFalse();
        expect(loading2).toBeFalse();
      }));
    });
  });
});
