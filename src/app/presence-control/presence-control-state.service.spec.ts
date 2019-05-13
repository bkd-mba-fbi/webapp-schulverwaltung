import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PresenceControlStateService } from './presence-control-state.service';
import { LessonPresence } from '../shared/models/lesson-presence.model';
import { buildLessonPresence, buildLesson } from 'src/spec-builders';

describe('PresenceControlStateService', () => {
  let service: PresenceControlStateService;
  let httpTestingController: HttpTestingController;
  let selectedLessonCb: jasmine.Spy;
  let selectedLessonPresencesCb: jasmine.Spy;
  let isFirstLessonCb: jasmine.Spy;
  let isLastLessonCb: jasmine.Spy;

  let lessonPresences: LessonPresence[];
  let turnenFrisch: LessonPresence;
  let deutschEinstein: LessonPresence;
  let deutschFrisch: LessonPresence;
  let mathEinstein1: LessonPresence;
  let mathEinstein2: LessonPresence;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));

    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(PresenceControlStateService);

    selectedLessonCb = jasmine.createSpy('selectedLesson$ callback');
    service.selectedLesson$.subscribe(selectedLessonCb);

    selectedLessonPresencesCb = jasmine.createSpy(
      'selectedLessonPresences$ callback'
    );
    service.selectedLessonPresences$.subscribe(selectedLessonPresencesCb);

    isFirstLessonCb = jasmine.createSpy('isFirstLesson$ callback');
    service.isFirstLesson$.subscribe(isFirstLessonCb);

    isLastLessonCb = jasmine.createSpy('isLastLesson$ callback');
    service.isLastLesson$.subscribe(isLastLessonCb);

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max'
    );
    deutschEinstein = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert'
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
      deutschEinstein,
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

    expect(selectedLessonCb).toHaveBeenCalledWith(null);
    expect(selectedLessonPresencesCb).toHaveBeenCalledWith([]);
    expect(isFirstLessonCb).toHaveBeenCalledWith(false);
    expect(isLastLessonCb).toHaveBeenCalledWith(false);
  });

  it('initially selects the current lesson', () => {
    expectLessonPresencesRequest();

    expect(selectedLessonCb).toHaveBeenCalledWith(
      buildLesson(
        2,
        new Date(2000, 0, 23, 8, 0),
        new Date(2000, 0, 23, 9, 0),
        'Deutsch'
      )
    );
    expect(selectedLessonPresencesCb).toHaveBeenCalledWith([
      deutschEinstein,
      deutschFrisch
    ]);
    expect(isFirstLessonCb).toHaveBeenCalledWith(false);
    expect(isLastLessonCb).toHaveBeenCalledWith(false);
  });

  describe('.setDate', () => {
    it('loads lessons and presences of given day', () => {
      expectLessonPresencesRequest();

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
      expect(selectedLessonPresencesCb).toHaveBeenCalledWith([werkenFrisch]);
      expect(isFirstLessonCb).toHaveBeenCalledWith(true);
      expect(isLastLessonCb).toHaveBeenCalledWith(true);
    });
  });

  describe('.previousLesson', () => {
    it('emits presences for previous lesson', () => {
      expectLessonPresencesRequest();
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
      expect(selectedLessonPresencesCb).toHaveBeenCalledWith([turnenFrisch]);
      expect(isFirstLessonCb).toHaveBeenCalledWith(true);
      expect(isLastLessonCb).toHaveBeenCalledWith(false);
    });
  });

  describe('.nextLesson', () => {
    it('emits presences for next lesson', () => {
      expectLessonPresencesRequest(lessonPresences.slice(0, 4));
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
      expect(selectedLessonPresencesCb).toHaveBeenCalledWith([mathEinstein1]);
      expect(isFirstLessonCb).toHaveBeenCalledWith(false);
      expect(isLastLessonCb).toHaveBeenCalledWith(true);
    });
  });

  function resetCallbackSpies(): void {
    selectedLessonCb.calls.reset();
    selectedLessonPresencesCb.calls.reset();
  }

  function expectLessonPresencesRequest(
    response = lessonPresences,
    date = '2000-01-23'
  ): void {
    const url = `https://eventotest.api/LessonPresences?filter.LessonDateTimeFrom==${date}`;
    httpTestingController
      .expectOne(req => req.urlWithParams === url, url)
      .flush(t.array(LessonPresence).encode(response));
  }
});
