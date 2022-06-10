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
  buildPresenceControlEntry,
  buildPerson,
} from 'src/spec-builders';
import { PresenceType } from '../../shared/models/presence-type.model';
import { DropDownItem } from '../../shared/models/drop-down-item.model';
import { fromLesson } from '../models/lesson-entry.model';
import { LessonAbsence } from '../../shared/models/lesson-absence.model';
import { Person } from '../../shared/models/person.model';
import { UserSetting } from 'src/app/shared/models/user-setting.model';
import { PresenceControlGroupService } from './presence-control-group.service';
import { StorageService } from '../../shared/services/storage.service';

describe('PresenceControlStateService', () => {
  let service: PresenceControlStateService;
  let httpTestingController: HttpTestingController;
  let selectedLessonCb: jasmine.Spy;
  let selectedPresenceControlEntriesCb: jasmine.Spy;

  let presenceTypes: PresenceType[];
  let absent: PresenceType;
  let late: PresenceType;

  let confirmationStates: DropDownItem[];

  let otherAbsences: LessonAbsence[];
  let person: Person;

  let lessonPresences: LessonPresence[];
  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let mathEinstein1: LessonPresence;
  let mathEinstein2: LessonPresence;
  let mathEinstein3: LessonPresence;
  let mathEinstein4: LessonPresence;

  let userSettings: UserSetting[];

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2000, 0, 23, 8, 30));

    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          PresenceControlStateService,
          PresenceControlGroupService,
          StorageService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: '3' };
              },
            },
          },
        ],
      })
    );
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PresenceControlStateService);

    selectedLessonCb = jasmine.createSpy('selectedLesson$ callback');
    service.selectedLesson$.subscribe(selectedLessonCb);

    selectedPresenceControlEntriesCb = jasmine.createSpy(
      'selectedPresenceControlEntries$ callback'
    );
    service.selectedPresenceControlEntries$.subscribe(
      selectedPresenceControlEntriesCb
    );

    absent = buildPresenceType(11, true, false);
    absent.Designation = 'Abwesend';
    late = buildPresenceType(12, false, true);
    presenceTypes = [absent, late];

    confirmationStates = [{ Key: 1080, Value: 'zu kontrollieren' }];

    otherAbsences = [];
    person = buildPerson(3);

    userSettings = [];

    turnenFrisch = buildLessonPresence(
      1,
      new Date(2000, 0, 23, 7, 0),
      new Date(2000, 0, 23, 8, 0),
      'Turnen',
      'Frisch Max',
      'Tina Tran'
    );
    deutschEinsteinAbwesend = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Einstein Albert',
      'Dora Durrer',
      absent.Id,
      333
    );
    deutschFrisch = buildLessonPresence(
      2,
      new Date(2000, 0, 23, 8, 0),
      new Date(2000, 0, 23, 9, 0),
      'Deutsch',
      'Frisch Max',
      'Dora Durrer',
      undefined,
      333
    );
    mathEinstein1 = buildLessonPresence(
      3,
      new Date(2000, 0, 23, 9, 0),
      new Date(2000, 0, 23, 10, 0),
      'Mathematik',
      'Einstein Albert',
      'Martina Moser',
      undefined,
      33,
      66
    );
    mathEinstein2 = buildLessonPresence(
      4,
      new Date(2000, 0, 23, 10, 0),
      new Date(2000, 0, 23, 11, 0),
      'Mathematik',
      'Einstein Albert',
      'Martina Moser',
      undefined,
      33,
      66
    );
    mathEinstein3 = buildLessonPresence(
      5,
      new Date(2000, 0, 23, 11, 0),
      new Date(2000, 0, 23, 12, 0),
      'Mathematik II',
      'Einstein Albert',
      'Martina Moser',
      undefined,
      34,
      66
    );
    mathEinstein4 = buildLessonPresence(
      6,
      new Date(2000, 0, 23, 13, 0),
      new Date(2000, 0, 23, 14, 0),
      'Mathematik',
      'Einstein Albert',
      'Martina Moser',
      undefined,
      35,
      66
    );
    lessonPresences = [
      turnenFrisch,
      deutschEinsteinAbwesend,
      deutschFrisch,
      mathEinstein1,
      mathEinstein2,
      mathEinstein3,
      mathEinstein4,
    ];
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    httpTestingController.verify();
  });

  it('emits null/empty array if no lesson presences are available', () => {
    expectLessonPresencesRequest([]);
    expectPresenceTypesRequest();
    expectAbsenceConfirmationStatesRequest();
    expectLoadOtherTeachersAbsencesRequest([], person.Id);

    expect(selectedLessonCb).toHaveBeenCalledWith(null);
    expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([]);

    expectCstRequest();
  });

  it('initially selects the current lesson', () => {
    expectLessonPresencesRequest();
    expectPresenceTypesRequest();
    expectAbsenceConfirmationStatesRequest();
    expectLoadOtherTeachersAbsencesRequest([], person.Id);

    expect(selectedLessonCb).toHaveBeenCalledWith(
      fromLesson(
        buildLesson(
          2,
          new Date(2000, 0, 23, 8, 0),
          new Date(2000, 0, 23, 9, 0),
          'Deutsch',
          'Dora Durrer',
          undefined,
          333
        )
      )
    );
    expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([
      buildPresenceControlEntry(deutschEinsteinAbwesend, absent),
      buildPresenceControlEntry(deutschFrisch),
    ]);

    expectCstRequest();
  });

  describe('.setDate', () => {
    afterEach(() => {
      httpTestingController.verify();
    });
    it('loads lessons and presences of given day', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      expectAbsenceConfirmationStatesRequest();
      expectLoadOtherTeachersAbsencesRequest([], person.Id);

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
        fromLesson(
          buildLesson(
            99,
            new Date(2000, 0, 10, 16, 0),
            new Date(2000, 0, 10, 17, 0),
            'Werken',
            ''
          )
        )
      );
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledWith([
        buildPresenceControlEntry(werkenFrisch),
      ]);

      expectCstRequest();
    });
  });

  describe('.updateLessonPresencesTypes', () => {
    afterEach(() => {
      httpTestingController.verify();
    });
    it('updates the lesson presences with the new presence type', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      expectAbsenceConfirmationStatesRequest();
      expectLoadOtherTeachersAbsencesRequest([], person.Id);

      service.setLesson(
        fromLesson(
          buildLesson(
            3,
            new Date(2000, 0, 23, 9, 0),
            new Date(2000, 0, 23, 10, 0),
            'Mathematik',
            'Monika Muster'
          )
        )
      );
      expectLoadOtherTeachersAbsencesRequest([], person.Id, [66]);

      resetCallbackSpies();

      service.updateLessonPresencesTypes([
        { presence: mathEinstein1, newPresenceTypeId: absent.Id },
      ]);

      expect(selectedLessonCb).not.toHaveBeenCalled();
      expect(selectedPresenceControlEntriesCb).toHaveBeenCalledTimes(1);

      const [entries] = selectedPresenceControlEntriesCb.calls.argsFor(0);
      expect(entries.length).toBe(1);
      expect(entries[0].lessonPresence.TypeRef.Id).toBe(absent.Id);
      expect(entries[0].lessonPresence.Type).toBe('Abwesend');
      expect(entries[0].presenceType).toBe(absent);

      expectLoadOtherTeachersAbsencesRequest([], person.Id, [66]);

      expectCstRequest();
    });
  });

  describe('.getBlockLessonPresences', () => {
    afterEach(() => {
      httpTestingController.verify();
    });
    it('returns all block lessons for the given entry', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      expectAbsenceConfirmationStatesRequest();
      expectLoadOtherTeachersAbsencesRequest([], person.Id);

      service
        .getBlockLessonPresences(buildPresenceControlEntry(mathEinstein1))
        .subscribe((result) =>
          expect(result).toEqual([mathEinstein1, mathEinstein2, mathEinstein3])
        );

      expectCstRequest();
    });

    it('returns single lesson for the given entry', () => {
      expectLessonPresencesRequest();
      expectPresenceTypesRequest();
      expectAbsenceConfirmationStatesRequest();
      expectLoadOtherTeachersAbsencesRequest([], person.Id);

      service
        .getBlockLessonPresences(buildPresenceControlEntry(deutschFrisch))
        .subscribe((result) => expect(result).toEqual([deutschFrisch]));

      expectCstRequest();
    });
  });

  function resetCallbackSpies(): void {
    selectedLessonCb.calls.reset();
    selectedPresenceControlEntriesCb.calls.reset();
  }

  function expectLessonPresencesRequest(
    response = lessonPresences,
    date?: string
  ): void {
    const url = date
      ? `https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==${date}`
      : 'https://eventotest.api/LessonPresences/Today';

    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(t.array(LessonPresence).encode(response));
  }

  function expectCstRequest(response = userSettings): void {
    const url = 'https://eventotest.api/UserSettings/Cst';
    httpTestingController
      .expectOne(url)
      .flush(t.array(UserSetting).encode(response));
  }

  function expectPresenceTypesRequest(response = presenceTypes): void {
    const url = 'https://eventotest.api/PresenceTypes/';
    httpTestingController
      .expectOne(url)
      .flush(t.array(PresenceType).encode(response));
  }

  function expectAbsenceConfirmationStatesRequest(
    response = confirmationStates
  ): void {
    const url =
      'https://eventotest.api/DropDownItems/AbsenceConfirmationStates';
    httpTestingController
      .expectOne(url)
      .flush(t.array(DropDownItem).encode(response));
  }

  function expectLoadOtherTeachersAbsencesRequest(
    response = otherAbsences,
    personId: number,
    students?: number[]
  ): void {
    let url = `https://eventotest.api/LessonTeachers/except/${personId}/LessonAbsences?expand=LessonRef`;
    if (students && students.length > 0) {
      url = url.concat('&filter.StudentRef=;', students.join(';'));
    }
    httpTestingController
      .expectOne(url)
      .flush(t.array(LessonAbsence).encode(response));
  }
});
