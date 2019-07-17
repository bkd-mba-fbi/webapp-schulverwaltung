import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceControlStateService } from './presence-control-state.service';
import { LessonPresence } from '../../shared/models/lesson-presence.model';
import {
  buildLessonPresence,
  buildLesson,
  buildPresenceType,
  buildPresenceControlEntry
} from 'src/spec-builders';
import { PresenceType } from '../../shared/models/presence-type.model';

describe('PresenceControlStateService', () => {
  let service: PresenceControlStateService;
  let httpTestingController: HttpTestingController;
  let selectedLessonCb: jasmine.Spy;
  let selectedPresenceControlEntriesCb: jasmine.Spy;
  let isFirstLessonCb: jasmine.Spy;
  let isLastLessonCb: jasmine.Spy;

  let presenceTypes: PresenceType[];
  let absent: PresenceType;
  let late: PresenceType;

  let lessonPresences: LessonPresence[];
  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let mathEinstein1: LessonPresence;
  let mathEinstein2: LessonPresence;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [PresenceControlStateService] })
    );
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(PresenceControlStateService);

    selectedLessonCb = jasmine.createSpy('selectedLesson$ callback');
    service.selectedLesson$.subscribe(selectedLessonCb);

    selectedPresenceControlEntriesCb = jasmine.createSpy(
      'selectedPresenceControlEntries$ callback'
    );
    service.selectedPresenceControlEntries$.subscribe(
      selectedPresenceControlEntriesCb
    );

    isFirstLessonCb = jasmine.createSpy('isFirstLesson$ callback');
    service.isFirstLesson$.subscribe(isFirstLessonCb);

    isLastLessonCb = jasmine.createSpy('isLastLesson$ callback');
    service.isLastLesson$.subscribe(isLastLessonCb);

    absent = buildPresenceType(11, 377, true, false);
    absent.Designation = 'Abwesend';
    late = buildPresenceType(12, 380, false, true);
    presenceTypes = [absent, late];

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max'
    );
    deutschEinsteinAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert',
      absent.Id
    );
    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Frisch Max'
    );
    mathEinstein1 = buildLessonPresence(
      3,
      new Date(2000, 0, 23, 9, 0),
      new Date(2000, 0, 23, 10, 0),
      'Mathematik',
      'Einstein Albert'
    );
    mathEinstein2 = buildLessonPresence(
      4,
      new Date(2000, 0, 23, 10, 0),
      new Date(2000, 0, 23, 11, 0),
      'Mathematik',
      'Einstein Albert'
    );
    lessonPresences = [
      turnenFrisch,
      deutschEinsteinAbwesend,
      deutschFrisch,
      mathEinstein1,
      mathEinstein2
    ];
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    httpTestingController.verify();
  });

  it('emits null/empty array if no lesson presences are available', () => {
    expectLessonPresencesRequest([]);
    expectPresenceTypesRequest();

    expect(selectedLessonCb).toHaveBeenCalledWith(null);
    expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([]);
    expect(isFirstLessonCb).toHaveBeenCalledWith(false);
    expect(isLastLessonCb).toHaveBeenCalledWith(false);
  });

  it('initially selects the current lesson', () => {
    expectLessonPresencesRequest();
    expectPresenceTypesRequest();

    expect(selectedLessonCb).toHaveBeenCalledWith(
      buildLesson(
        2,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        'Deutsch'
      )
    );
    expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([
      buildPresenceControlEntry(deutschEinsteinAbwesend, absent),
      buildPresenceControlEntry(deutschFrisch)
    ]);
    expect(isFirstLessonCb).toHaveBeenCalledWith(false);
    expect(isLastLessonCb).toHaveBeenCalledWith(false);
  });

  describe('.setDate', () => {
    it('loads lessons and presences of given day', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();

      resetCallbackSpies();
      service.setDate(new Date(2000, 0, 10, 12, 0));
      const werkenFrisch = buildLessonPresence(
        99,
        new Date(2000, 0, 10, 16, 0),
        new Date(2000, 0, 10, 17, 0),
        'Werken',
        'Frisch Max'
      );
      expectLessonPresencesRequest([werkenFrisch], '2000-01-10');

      expect(selectedLessonCb).toHaveBeenCalledWith(
        buildLesson(
          99,
          new Date(2000, 0, 10, 16, 0),
          new Date(2000, 0, 10, 17, 0),
          'Werken'
        )
      );
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([
        buildPresenceControlEntry(werkenFrisch)
      ]);
      expect(isFirstLessonCb).toHaveBeenCalledWith(true);
      expect(isLastLessonCb).toHaveBeenCalledWith(true);
    });
  });

  describe('.previousLesson', () => {
    it('emits presences for previous lesson', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      resetCallbackSpies();
      service.previousLesson();

      expect(selectedLessonCb).toHaveBeenCalledWith(
        buildLesson(
          1,
          new Date(2000, 0, 23, 7, 0),
          new Date(2000, 0, 23, 8, 0),
          'Turnen'
        )
      );
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([
        buildPresenceControlEntry(turnenFrisch)
      ]);
      expect(isFirstLessonCb).toHaveBeenCalledWith(true);
      expect(isLastLessonCb).toHaveBeenCalledWith(false);
    });
  });

  describe('.nextLesson', () => {
    it('emits presences for next lesson', () => {
      expectLessonPresencesRequest(lessonPresences.slice(0, 4));
      expectPresenceTypesRequest();
      resetCallbackSpies();
      service.nextLesson();

      expect(selectedLessonCb).toHaveBeenCalledWith(
        buildLesson(
          3,
          new Date(2000, 0, 23, 9, 0),
          new Date(2000, 0, 23, 10, 0),
          'Mathematik'
        )
      );
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([
        buildPresenceControlEntry(mathEinstein1)
      ]);
      expect(isFirstLessonCb).toHaveBeenCalledWith(false);
      expect(isLastLessonCb).toHaveBeenCalledWith(true);
    });
  });

  describe('.updateLessonPresencesTypes', () => {
    it('updates the lesson presences with the new presence type', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      service.nextLesson();
      resetCallbackSpies();

      service.updateLessonPresencesTypes([
        { presence: mathEinstein1, newPresenceTypeId: absent.Id }
      ]);

      expect(selectedLessonCb).not.toHaveBeenCalled();
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledTimes(1);

      const [entries] = selectedPresenceControlEntriesCb.calls.argsFor(0);
      expect(entries.length).toBe(1);
      expect(entries[0].lessonPresence.TypeRef.Id).toBe(absent.Id);
      expect(entries[0].lessonPresence.Type).toBe('Abwesend');
      expect(entries[0].presenceType).toBe(absent);
    });
  });

  describe('.updateLessonPresenceComment', () => {
    it('updates the comment of the affected lesson presence', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      service.nextLesson();
      resetCallbackSpies();

      service.updateLessonPresenceComment(mathEinstein1, 'e = mc^2');

      expect(selectedLessonCb).not.toHaveBeenCalled();
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledTimes(1);

      const [entries] = selectedPresenceControlEntriesCb.calls.argsFor(0);
      expect(entries.length).toBe(1);
      expect(entries[0].lessonPresence.Comment).toBe('e = mc^2');
    });
  });

  function resetCallbackSpies(): void {
    selectedLessonCb.calls.reset();
    selectedPresenceControlEntriesCb.calls.reset();
  }

  function expectLessonPresencesRequest(
    response = lessonPresences,
    date = '2000-01-23'
  ): void {
    const url = `https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==${date}`;
    httpTestingController
      .expectOne(req => req.urlWithParams === url, url)
      .flush(t.array(LessonPresence).encode(response));
  }

  function expectPresenceTypesRequest(response = presenceTypes): void {
    const url = 'https://eventotest.api/PresenceTypes/';
    httpTestingController
      .expectOne(url)
      .flush(t.array(PresenceType).encode(response));
  }
});
