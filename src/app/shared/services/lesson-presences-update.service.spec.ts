import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import {
  buildLessonPresence,
  buildPresenceType,
  buildReference
} from 'src/spec-builders';
import {
  LessonPresencesUpdateService,
  UPDATE_REQUEST_DEBOUNCE_TIME,
  UPDATE_ACTION_DEBOUNCE_TIME
} from './lesson-presences-update.service';
import { LessonPresence } from '../models/lesson-presence.model';
import { PresenceType } from '../models/presence-type.model';
import { LessonPresencesUpdateRestService } from './lesson-presences-update-rest.service';
import { PresenceControlStateService } from '../../presence-control/services/presence-control-state.service';
import { withConfig } from 'src/app/rest-error-interceptor';

describe('LessonPresencesUpdateService', () => {
  let service: LessonPresencesUpdateService;
  let restServiceMock: LessonPresencesUpdateRestService;
  let stateServiceMock: PresenceControlStateService;
  let toastrServiceMock: ToastrService;

  let absent: PresenceType;
  let late: PresenceType;

  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let deutschWalser: LessonPresence;

  beforeEach(() => {
    restServiceMock = ({
      editLessonPresences: jasmine
        .createSpy('editLessonPresences')
        .and.callFake(() => of()),
      removeLessonPresences: jasmine
        .createSpy('removeLessonPresences')
        .and.callFake(() => of())
    } as unknown) as LessonPresencesUpdateRestService;

    stateServiceMock = ({
      updateLessonPresences: jasmine.createSpy('updateLessonPresences')
    } as unknown) as PresenceControlStateService;

    toastrServiceMock = ({
      error: jasmine.createSpy('error')
    } as unknown) as ToastrService;

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: LessonPresencesUpdateRestService,
            useValue: restServiceMock
          },
          { provide: PresenceControlStateService, useValue: stateServiceMock },
          { provide: ToastrService, useValue: toastrServiceMock }
        ]
      })
    );
    service = TestBed.get(LessonPresencesUpdateService);

    absent = buildPresenceType(11, 377, 1, 0);
    late = buildPresenceType(12, 380, 0, 1);

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
  });

  describe('.updatePresenceTypes', () => {
    it('updates presence type of given lesson presences, performing only one request if executed within debounce time', fakeAsync(() => {
      // Change Einstein & Frisch to 'late'
      service.updatePresenceTypes(
        [deutschEinsteinAbwesend, deutschFrisch],
        late.Id
      );
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      // State gets updated for both
      tick(UPDATE_ACTION_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: late.Id },
        { presence: deutschFrisch, newPresenceTypeId: late.Id }
      ]);

      // Nothing happens after half the debounce time
      (stateServiceMock.updateLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME / 2);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      // Also change Walser to 'late' after half the debounce time, updates state
      service.updatePresenceTypes([deutschWalser], late.Id);
      tick(UPDATE_ACTION_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: late.Id },
        { presence: deutschFrisch, newPresenceTypeId: late.Id },
        { presence: deutschWalser, newPresenceTypeId: late.Id }
      ]);

      // Waits whole debounce time, then performs requests for all three
      (stateServiceMock.updateLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(
        (restServiceMock.editLessonPresences as jasmine.Spy).calls.count()
      ).toBe(1);
      expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
        [deutschEinsteinAbwesend.LessonRef.Id],
        [
          deutschEinsteinAbwesend.StudentRef.Id,
          deutschFrisch.StudentRef.Id,
          deutschWalser.StudentRef.Id
        ],
        late.Id,
        null,
        withConfig({ disableErrorHandling: true })
      );
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      // Nothing happens afterwards
      (restServiceMock.editLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_ACTION_DEBOUNCE_TIME + UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      expect(toastrServiceMock.error).not.toHaveBeenCalled();
    }));

    it('it reverts state of lesson presence if request fails', fakeAsync(() => {
      (restServiceMock.editLessonPresences as jasmine.Spy).and.callFake(
        (lessonIds, personIds, newPresenceTypeId) => {
          if (personIds.includes(deutschWalser.StudentRef.Id)) {
            return throwError('oops');
          }
          return of();
        }
      );

      // Change Einstein & Frisch to 'late', Walser to 'absent'
      service.updatePresenceTypes(
        [deutschEinsteinAbwesend, deutschFrisch],
        late.Id
      );
      service.updatePresenceTypes([deutschWalser], absent.Id);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      // State gets optimistically updated for all three
      tick(UPDATE_ACTION_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: late.Id },
        { presence: deutschFrisch, newPresenceTypeId: late.Id },
        { presence: deutschWalser, newPresenceTypeId: absent.Id }
      ]);

      // Performs two requests and reverts Walser on error of second request
      (stateServiceMock.updateLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(
        (restServiceMock.editLessonPresences as jasmine.Spy).calls.count()
      ).toBe(2);
      expect(restServiceMock.editLessonPresences).toHaveBeenCalledWith(
        [deutschEinsteinAbwesend.LessonRef.Id],
        [deutschEinsteinAbwesend.StudentRef.Id, deutschFrisch.StudentRef.Id],
        late.Id,
        null,
        withConfig({ disableErrorHandling: true })
      );
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).toHaveBeenCalledWith([
        { presence: deutschWalser, newPresenceTypeId: 123 }
      ]);
      expect(toastrServiceMock.error).toHaveBeenCalledWith(
        'shared.lesson-presences-update.error'
      );

      // Nothing happens afterwards
      (restServiceMock.editLessonPresences as jasmine.Spy).calls.reset();
      (stateServiceMock.updateLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_ACTION_DEBOUNCE_TIME + UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();
    }));

    it('it executes remove request for entries set to "present"', fakeAsync(() => {
      // Change Einstein to 'present'
      service.updatePresenceTypes([deutschEinsteinAbwesend], null);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      // State gets updated
      tick(UPDATE_ACTION_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).toHaveBeenCalledWith([
        { presence: deutschEinsteinAbwesend, newPresenceTypeId: null }
      ]);

      // Waits debounce time, then performs request
      (stateServiceMock.updateLessonPresences as jasmine.Spy).calls.reset();
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
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      // Nothing happens afterwards
      (restServiceMock.removeLessonPresences as jasmine.Spy).calls.reset();
      tick(UPDATE_ACTION_DEBOUNCE_TIME + UPDATE_REQUEST_DEBOUNCE_TIME);
      expect(restServiceMock.editLessonPresences).not.toHaveBeenCalled();
      expect(restServiceMock.removeLessonPresences).not.toHaveBeenCalled();
      expect(stateServiceMock.updateLessonPresences).not.toHaveBeenCalled();

      expect(toastrServiceMock.error).not.toHaveBeenCalled();
    }));
  });
});
