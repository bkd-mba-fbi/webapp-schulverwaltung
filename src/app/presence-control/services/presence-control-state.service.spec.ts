import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';
import { of } from 'rxjs';

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
import { PresenceControlGroupService } from './presence-control-group.service';
import { StorageService } from '../../shared/services/storage.service';
import { UserSettingsService } from 'src/app/shared/services/user-settings.service';
import { Lesson } from 'src/app/shared/models/lesson.model';

describe('PresenceControlStateService', () => {
  let service: PresenceControlStateService;
  let httpTestingController: HttpTestingController;
  let selectedLessonCb: jasmine.Spy;
  let presenceControlEntriesCb: jasmine.Spy;

  let presenceTypes: PresenceType[];
  let absent: PresenceType;
  let late: PresenceType;

  let confirmationStates: DropDownItem[];

  let otherAbsences: LessonAbsence[];
  let person: Person;

  let lessons: Lesson[];
  let lessonPresences: LessonPresence[];
  let turnenFrisch: LessonPresence;
  let deutschEinsteinAbwesend: LessonPresence;
  let deutschFrisch: LessonPresence;
  let mathEinstein1: LessonPresence;
  let mathEinstein2: LessonPresence;
  let mathEinstein3: LessonPresence;
  let mathEinstein4: LessonPresence;

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
          {
            provide: UserSettingsService,
            useValue: {
              getPresenceControlViewMode() {
                return of({ Id: 'Cst', Settings: [] });
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

    presenceControlEntriesCb = jasmine.createSpy(
      'presenceControlEntries$ callback'
    );
    service.presenceControlEntries$.subscribe(presenceControlEntriesCb);

    absent = buildPresenceType(11, true, false);
    absent.Designation = 'Abwesend';
    late = buildPresenceType(12, false, true);
    presenceTypes = [absent, late];

    confirmationStates = [{ Key: 1080, Value: 'zu kontrollieren' }];

    otherAbsences = [];
    person = buildPerson(3);

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
    lessons = lessonsFromPresences(lessonPresences);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    httpTestingController.verify();
  });

  it("loads today's lessons & presences of the currently ongoing lesson per default", () => {
    service.setLessonId();
    expectLessonsRequest();
    expectLessonPresencesRequest(lessonPresences, [2]);
    expectPresenceTypesRequest();
    expectAbsenceConfirmationStatesRequest();
    expectLoadOtherTeachersAbsencesRequest([], person.Id, [123, 66]);

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
    expect(presenceControlEntriesCb).toHaveBeenCalledWith([
      buildPresenceControlEntry(deutschEinsteinAbwesend, absent),
      buildPresenceControlEntry(deutschFrisch),
    ]);
  });

  it('loads lessons of given day, then loads presences of selected lesson', () => {
    service.setLessonId();
    expectLessonsRequest();
    expectLessonPresencesRequest();
    expectPresenceTypesRequest();
    expectAbsenceConfirmationStatesRequest();
    expectLoadOtherTeachersAbsencesRequest([], person.Id, [123, 66]);

    resetCallbackSpies();
    service.setDate(new Date(2000, 0, 10));
    const werkenFrisch = buildLessonPresence(
      99,
      new Date(2000, 0, 10, 16, 0),
      new Date(2000, 0, 10, 17, 0),
      'Werken',
      'Frisch Max'
    );
    expectLessonsRequest(lessonsFromPresences([werkenFrisch]), '2000-01-10');
    expectLessonPresencesRequest([werkenFrisch], [99]);
    expectLoadOtherTeachersAbsencesRequest([], person.Id, [123]);

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
    expect(presenceControlEntriesCb).toHaveBeenCalledWith([
      buildPresenceControlEntry(werkenFrisch),
    ]);
  });

  describe('.updateLessonPresencesTypes', () => {
    it('updates the lesson presences with the new presence type', () => {
      service.setLessonId(3);
      expectLessonsRequest();
      expectLessonPresencesRequest(
        lessonPresences.filter((p) => p.LessonRef.Id === 3),
        [3]
      );
      expectPresenceTypesRequest();
      expectAbsenceConfirmationStatesRequest();
      expectLoadOtherTeachersAbsencesRequest([], person.Id, [66]);

      resetCallbackSpies();

      service.updateLessonPresencesTypes([
        { presence: mathEinstein1, newPresenceTypeId: absent.Id },
      ]);

      expect(selectedLessonCb).not.toHaveBeenCalled();
      expect(presenceControlEntriesCb).toHaveBeenCalledTimes(1);

      const [entries] = presenceControlEntriesCb.calls.argsFor(0);
      expect(entries.length).toBe(1);
      expect(entries[0].lessonPresence.TypeRef.Id).toBe(absent.Id);
      expect(entries[0].lessonPresence.Type).toBe('Abwesend');
      expect(entries[0].presenceType).toBe(absent);
    });
  });

  function resetCallbackSpies(): void {
    selectedLessonCb.calls.reset();
    presenceControlEntriesCb.calls.reset();
  }

  function expectLessonsRequest(response = lessons, date?: string): void {
    date = date ? date : '2000-01-23';
    const url = `https://eventotest.api/LessonPresences/?fields=LessonRef,EventRef,EventDesignation,StudyClassNumber,TeacherInformation,LessonDateTimeFrom,LessonDateTimeTo&filter.LessonDateTimeFrom==${date}`;

    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(t.array(Lesson).encode(response));
  }

  function expectLessonPresencesRequest(
    response = lessonPresences,
    lessionIds = [2]
  ): void {
    const url = `https://eventotest.api/LessonPresences/?filter.LessonRef=;${lessionIds.join(
      ';'
    )}`;

    httpTestingController
      .expectOne((req) => req.urlWithParams === url, url)
      .flush(t.array(LessonPresence).encode(response));
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

  function lessonsFromPresences(presences: LessonPresence[]): Lesson[] {
    return presences.map((p) =>
      Object.keys(Lesson.props).reduce(
        (obj, key) => ({ ...obj, [key]: (p as any)[key] }),
        {} as Lesson
      )
    );
  }
});
