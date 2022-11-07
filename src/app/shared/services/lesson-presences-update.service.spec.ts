import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { withConfig } from 'src/app/rest-error-interceptor';
import {
  buildLessonPresence,
  buildPresenceControlEntry,
  buildPresenceType,
  buildReference,
} from 'src/spec-builders';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresence } from '../models/lesson-presence.model';
import { PresenceType } from '../models/presence-type.model';
import { LessonPresencesUpdateRestService } from './lesson-presences-update-rest.service';
import {
  LessonPresencesUpdateService,
  UPDATE_REQUEST_DEBOUNCE_TIME,
  UPDATE_STATE_DEBOUNCE_TIME,
} from './lesson-presences-update.service';
import { PresenceTypesService } from './presence-types.service';
import { ToastService } from './toast.service';
import { PresenceControlEntry } from '../../presence-control/models/presence-control-entry.model';

describe('LessonPresencesUpdateService', () => {
  let service: LessonPresencesUpdateService;
  let restServiceMock: LessonPresencesUpdateRestService;
  let toastServiceMock: ToastService;
  let presenceTypeServiceMock: PresenceTypesService;
  let stateUpdatesCallback: jasmine.Spy;

  let absent: PresenceType;
  let late: PresenceType;

  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let deutschWalser: LessonPresence;

  let entryDeutschEinsteinAbwesend: PresenceControlEntry;
  let entryDeutschWalser: PresenceControlEntry;
  let entryDeutschFrisch: PresenceControlEntry;

  absent = buildPresenceType(11, true, false);
  late = buildPresenceType(12, false, true);

  beforeEach(() => {
    restServiceMock = {
      editLessonPresences: jasmine
        .createSpy('editLessonPresences')
        .and.callFake(() => of()),
      removeLessonPresences: jasmine
        .createSpy('removeLessonPresences')
        .and.callFake(() => of()),
    } as unknown as LessonPresencesUpdateRestService;

    presenceTypeServiceMock = {
      getPresenceType: jasmine
        .createSpy('getPresenceType')
        .withArgs(absent.Id)
        .and.callFake(() => of(absent))
        .withArgs(late.Id)
        .and.callFake(() => of(late)),
    } as unknown as PresenceTypesService;

    toastServiceMock = {
      error: jasmine.createSpy('error'),
    } as unknown as ToastService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: LessonPresencesUpdateRestService,
            useValue: restServiceMock,
          },
          { provide: PresenceTypesService, useValue: presenceTypeServiceMock },
          { provide: ToastService, useValue: toastServiceMock },
        ],
      })
    );
    service = TestBed.inject(LessonPresencesUpdateService);

    stateUpdatesCallback = jasmine.createSpy('stateUpdates$');
    service.stateUpdates$.subscribe(stateUpdatesCallback);

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max'
    );
    turnenFrisch.StudentRef = buildReference(10);

    deutschEinsteinAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert',
      'Dora Durrer',
      absent.Id
    );
    deutschEinsteinAbwesend.StudentRef = buildReference(20);

    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Frisch Max'
    );
    deutschFrisch.StudentRef = buildReference(10);

    deutschWalser = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Walser Robert'
    );
    deutschWalser.StudentRef = buildReference(30);

    entryDeutschEinsteinAbwesend = buildPresenceControlEntry(
      deutschEinsteinAbwesend
    );
    entryDeutschWalser = buildPresenceControlEntry(deutschWalser);
    entryDeutschFrisch = buildPresenceControlEntry(deutschFrisch);
  });

  describe('.updatePresenceType', () => {
    it('updates presence type of given lesson presences, performing only one request if executed within debounce time', fakeAsync(() => {
      // Change Einstein & Frisch to 'late'
      [entryDeutschEinsteinAbwesend, entryDeutschFrisch].forEach((entry) => {
        service.updatePresenceType(entry, late.Id);
      });
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      // State gets updated for both
      tick(UPDATE_STATE_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: late.Id },
        { presence: deutschFrisch, newPresenceTypeId: late.Id },
      ]);

      // Nothing happens after half the debounce time
      (stateUpdatesCallback as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME / 2);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      // Also change Walser to 'late' after half the debounce time, updates state
      service.updatePresenceType(entryDeutschWalser, late.Id);
      tick(UPDATE_STATE_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: late.Id },
        { presence: deutschFrisch, newPresenceTypeId: late.Id },
        { presence: deutschWalser, newPresenceTypeId: late.Id },
      ]);

      // Waits whole debounce time, then performs requests for all three
      (stateUpdatesCallback as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(
        (restServiceMock.editLessonPresences as jasmine.Spy).calls.count()
      ).toBe(1);
      expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
        [deutschEinsteinAbwesend.LessonRef.Id],
        [
          deutschEinsteinAbwesend.StudentRef.Id,
          deutschFrisch.StudentRef.Id,
          deutschWalser.StudentRef.Id,
        ],
        late.Id,
        undefined,
        withConfig({ disableErrorHandling: true })
      );
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      // Nothing happens afterwards
      (restServiceMock.editLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      expect(toastServiceMock.error).not.toHaveBeenCalled();
    }));

    it('it reverts state of lesson presence if request fails', fakeAsync(() => {
      deutschWalser.TypeRef.Id = 123;

      (restServiceMock.editLessonPresences as jasmine.Spy).and.callFake(
        (lessonIds, personIds) => {
          if (personIds.includes(deutschWalser.StudentRef.Id)) {
            return throwError('error thrown in mock');
          }
          return of();
        }
      );

      // Change Einstein & Frisch to 'late', Walser to 'absent'
      [entryDeutschEinsteinAbwesend, entryDeutschFrisch].forEach((entry) =>
        service.updatePresenceType(entry, late.Id)
      );

      service.updatePresenceType(entryDeutschWalser, absent.Id);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      // State gets optimistically updated for all three
      tick(UPDATE_STATE_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: late.Id },
        { presence: deutschFrisch, newPresenceTypeId: late.Id },
        { presence: deutschWalser, newPresenceTypeId: absent.Id },
      ]);

      // Performs two requests and reverts Walser on error of second request
      (stateUpdatesCallback as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(
        (restServiceMock.editLessonPresences as jasmine.Spy).calls.count()
      ).toBe(2);
      expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
        [deutschEinsteinAbwesend.LessonRef.Id],
        [deutschEinsteinAbwesend.StudentRef.Id, deutschFrisch.StudentRef.Id],
        late.Id,
        undefined,
        withConfig({ disableErrorHandling: true })
      );
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).toHaveBeenCalledWith([
        { presence: deutschWalser, newPresenceTypeId: 123 },
      ]);
      expect(toastServiceMock.error).toHaveBeenCalledWith(
        'shared.lesson-presences-update.error'
      );

      // Nothing happens afterwards
      (restServiceMock.editLessonPresences as jasmine.Spy).calls.reset();
      (stateUpdatesCallback as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();
    }));

    it('it executes remove request for entries set to "present"', fakeAsync(() => {
      // Change Einstein to 'present'
      service.updatePresenceType(entryDeutschEinsteinAbwesend, null);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      // State gets updated
      tick(UPDATE_STATE_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: null },
      ]);

      // Waits debounce time, then performs request
      (stateUpdatesCallback as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(
        (restServiceMock.removeLessonPresences as jasmine.Spy).calls.count()
      ).toBe(1);
      expect(restServiceMock.removeLessonPresences).toHaveBeenCalledWith(
        [deutschEinsteinAbwesend.LessonRef.Id],
        [deutschEinsteinAbwesend.StudentRef.Id],
        withConfig({ disableErrorHandling: true })
      );
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      // Nothing happens afterwards
      (restServiceMock.removeLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateUpdatesCallback).not.toHaveBeenCalled();

      expect(toastServiceMock.error).not.toHaveBeenCalled();
    }));
  });
});
