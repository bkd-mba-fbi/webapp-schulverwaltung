import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresencesRestService } from './lesson-presences-rest.service';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';
import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';
import { LessonPresenceStatistic } from '../models/lesson-presence-statistic';
import { LessonPresence } from '../models/lesson-presence.model';
import { buildLesson, buildLessonPresence } from 'src/spec-builders';
import { Sorting } from './sort.service';
import { format } from 'date-fns';

const CLASS_TEACHER_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlRlc3QiLCJjb25zdW1lcl9pZCI6ImRldiIsInVzZXJuYW1lIjoiam9obiIsImluc3RhbmNlX2lkIjoiVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjEyMyIsImlkX3BlcnNvbiI6IjQ1NiIsImZ1bGxuYW1lIjoiSm9obiBEb2UiLCJyb2xlcyI6Ikxlc3NvblRlYWNoZXJSb2xlO0NsYXNzVGVhY2hlclJvbGUiLCJ0b2tlbl9pZCI6IjEyMzQ1NiJ9.erGO0ORYWA7LAjuWSrz924rkgC2Gqg6_Wu3GUZiMOyI';

const LESSON_TEACHER_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlRlc3QiLCJjb25zdW1lcl9pZCI6ImRldiIsInVzZXJuYW1lIjoiam9obiIsImluc3RhbmNlX2lkIjoiVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjEyMyIsImlkX3BlcnNvbiI6IjQ1NiIsImZ1bGxuYW1lIjoiSm9obiBEb2UiLCJyb2xlcyI6Ikxlc3NvblRlYWNoZXJSb2xlIiwidG9rZW5faWQiOiIxMjM0NTYifQ.w2j7_k48rm1gY6RAieS0KG8-wFvK9T-y731w8Lun5Nk';

// with roles 'AbsenceAdministratorRole;SubstituteAdministratorRole'
const ABSENCE_ADMINISTRATOR_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjbHguYmt0Lmlzc3Vlci5ldmVudG8ub2F1dGgiLCJhdWQiOiJodHRwczovL1B1enpsZS8iLCJuYmYiOjE2Njg0MjA2NzUsImV4cCI6MTY2ODQzNTM3NSwidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJQdXp6bGUiLCJpbnN0YW5jZV9pZCI6Ikd5bUhvZndpbCIsInVzZXJuYW1lIjoiNjk5OCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwibG9naW5fdHlwZSI6IlBlcnNvbiIsImlkX21hbmRhbnQiOiIyMTciLCJpZF9wZXJzb24iOiI2OTk4IiwiZnVsbG5hbWUiOiJNYXJpYSBTdXBlcnVzZXJpbiIsInJvbGVzIjoiQWJzZW5jZUFkbWluaXN0cmF0b3JSb2xlO1N1YnN0aXR1dGVBZG1pbmlzdHJhdG9yUm9sZSIsInRva2VuX2lkIjoiMTA1NDUyIn0.peLj6jgOBBOuUjpxAmLEv9PCixjOFZug5hiPROv4oyw';

describe('LessonPresencesRestService', () => {
  let service: LessonPresencesRestService;
  let httpTestingController: HttpTestingController;
  let storeMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(LessonPresencesRestService);
    httpTestingController = TestBed.inject(HttpTestingController);

    storeMock = {};
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => storeMock[key] || null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string) => storeMock[key] || null
    );
  });

  describe('.get', () => {
    const ref = {
      Id: 123,
      HRef: '',
    };
    const data: Readonly<any> = {
      Id: '1',
      LessonRef: ref,
      StudentRef: ref,
      EventRef: ref,
      TypeRef: { Id: null, HRef: null },
      RegistrationRef: { Id: null, HRef: null },
      StudyClassRef: ref,
      EventTypeId: 123,
      ConfirmationState: null,
      ConfirmationStateId: null,
      EventDesignation: '',
      EventNumber: '',
      HasStudyCourseConfirmationCode: false,
      IsReadOnly: false,
      LessonDateTimeFrom: '2019-04-25T07:45:00',
      LessonDateTimeTo: '2019-04-25T08:30:00',
      Comment: null,
      Date: '2019-04-18',
      Type: null,
      StudentFullName: '',
      StudyClassDesignation: '',
      StudyClassNumber: '',
      TeacherInformation: '',
    };

    it('decodes ISO date strings to date objects', () => {
      service.get(123).subscribe((result) => {
        expect(result.LessonDateTimeFrom).toEqual(
          new Date('2019-04-25T07:45:00')
        );
        expect(result.LessonDateTimeTo).toEqual(
          new Date('2019-04-25T08:30:00')
        );
        expect(result.Date).toEqual(new Date('2019-04-18T00:00:00'));
      });

      httpTestingController
        .expectOne('https://eventotest.api/LessonPresences/123')
        .flush(data);

      httpTestingController.verify();
    });
  });

  describe('.getLessonsByDate', () => {
    it('fetches list filtered by given date and student', () => {
      const data: any[] = [
        buildLesson(
          1,
          new Date(2000, 0, 23, 9, 0),
          new Date(2000, 0, 23, 10, 0),
          'Mathematik',
          ''
        ),
        buildLesson(
          2,
          new Date(2000, 0, 23, 10, 0),
          new Date(2000, 0, 23, 11, 0),
          'Französisch',
          ''
        ),
        buildLesson(
          3,
          new Date(2000, 0, 23, 11, 0),
          new Date(2000, 0, 23, 12, 0),
          'Turnen',
          ''
        ),
      ];

      service
        .getLessonsByDate(new Date(2000, 0, 23))
        .subscribe((result) => expect(result).toEqual(data));

      const url =
        'https://eventotest.api/LessonPresences/?fields=LessonRef,EventRef,EventDesignation,StudyClassNumber,TeacherInformation,LessonDateTimeFrom,LessonDateTimeTo&filter.LessonDateTimeFrom==2000-01-23';
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(
          data.map(({ LessonDateTimeFrom, LessonDateTimeTo, ...lesson }) => ({
            ...lesson,
            LessonDateTimeFrom: format(
              LessonDateTimeFrom,
              "yyyy-MM-dd'T'HH:mm:ss"
            ),
            LessonDateTimeTo: format(LessonDateTimeTo, "yyyy-MM-dd'T'HH:mm:ss"),
          }))
        );

      httpTestingController.verify();
    });
  });

  describe('.getListByDateStudentClass', () => {
    it('fetches list filtered by given date and student', () => {
      const data: any[] = [];
      service
        .getListByDateStudentClass(new Date(2000, 0, 23), 123, 456)
        .subscribe((result) => expect(result).toBe(data));

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==2000-01-23&filter.StudentRef==123&filter.StudyClassRef==456';
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);

      httpTestingController.verify();
    });
  });

  describe('.getListForToday', () => {
    it("fetches list filtered by today's date", () => {
      const data: any[] = [];
      service
        .getListForToday()
        .subscribe((result) => expect(result).toBe(data));

      const url = 'https://eventotest.api/LessonPresences/Today';
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);

      httpTestingController.verify();
    });
  });

  describe('.getListOfUnconfirmed', () => {
    const classTeacherRequestUrl =
      'https://eventotest.api/LessonPresences/?filter.ConfirmationStateId==219&filter.HasStudyCourseConfirmationCode==true';
    const lessonTeacherRequestUrl =
      'https://eventotest.api/LessonPresences/?filter.ConfirmationStateId==219&filter.HasStudyCourseConfirmationCode==false';
    const absenceAdministratorRequestUrl =
      'https://eventotest.api/LessonPresences/?filter.ConfirmationStateId==219';

    let presence1: LessonPresence;
    let presence2: LessonPresence;
    let presence3: LessonPresence;

    beforeEach(() => {
      presence1 = buildLessonPresence(1, new Date(), new Date(), 'Mathematik');
      presence1.Id = '1';
      presence2 = buildLessonPresence(2, new Date(), new Date(), 'Französisch');
      presence2.Id = '2';
      presence3 = buildLessonPresence(3, new Date(), new Date(), 'Turnen');
      presence3.Id = '3';
    });

    describe('for lesson teacher', () => {
      beforeEach(() => {
        storeMock['CLX.LoginToken'] = LESSON_TEACHER_TOKEN;
      });

      it('return unconfirmed absences for lesson teacher role', () => {
        service.getListOfUnconfirmed().subscribe((result) => {
          expect(result.map((p) => p.Id)).toEqual([presence1.Id]);
        });

        httpTestingController
          .expectOne(
            (req) =>
              req.urlWithParams === lessonTeacherRequestUrl &&
              req.headers.get('X-Role-Restriction') === 'LessonTeacherRole',
            lessonTeacherRequestUrl
          )
          .flush(t.array(LessonPresence).encode([presence1]));

        httpTestingController.verify();
      });
    });

    describe('for class teacher', () => {
      beforeEach(() => {
        storeMock['CLX.LoginToken'] = CLASS_TEACHER_TOKEN;
      });

      it('returns unconfirmed absences for both class teacher and lesson teacher roles', () => {
        service.getListOfUnconfirmed().subscribe((result) => {
          expect(result.map((p) => p.Id)).toEqual([
            presence1.Id,
            presence2.Id,
            presence3.Id,
          ]);
        });

        const calls = httpTestingController.match(
          (request) =>
            request.urlWithParams === classTeacherRequestUrl ||
            request.urlWithParams === lessonTeacherRequestUrl
        );
        expect(calls.length).toBe(2);

        const classTeacherRequest = calls.find(
          (r) => r.request.urlWithParams === classTeacherRequestUrl
        );
        expect(classTeacherRequest).toBeDefined();
        expect(
          classTeacherRequest?.request.headers.get('X-Role-Restriction')
        ).toBe('ClassTeacherRole');
        classTeacherRequest?.flush(
          t.array(LessonPresence).encode([presence1, presence2])
        );

        const lessonTeacherRequest = calls.find(
          (r) => r.request.urlWithParams === lessonTeacherRequestUrl
        );
        expect(lessonTeacherRequest).toBeDefined();
        expect(
          lessonTeacherRequest?.request.headers.get('X-Role-Restriction')
        ).toBe('LessonTeacherRole');
        lessonTeacherRequest?.flush(
          t.array(LessonPresence).encode([presence2, presence3])
        );
      });
    });

    describe('for absence administrator', () => {
      beforeEach(() => {
        storeMock['CLX.LoginToken'] = ABSENCE_ADMINISTRATOR_TOKEN;
      });

      it('return unconfirmed absences for absence administrator role', () => {
        service.getListOfUnconfirmed().subscribe((result) => {
          expect(result.map((p) => p.Id)).toEqual([presence3.Id]);
        });

        httpTestingController
          .expectOne(
            (req) =>
              req.urlWithParams === absenceAdministratorRequestUrl &&
              req.headers.get('X-Role-Restriction') ===
                'AbsenceAdministratorRole',
            absenceAdministratorRequestUrl
          )
          .flush(t.array(LessonPresence).encode([presence3]));

        httpTestingController.verify();
      });
    });
  });

  describe('.getStatistics', () => {
    const data: any[] = [];
    let filter: EvaluateAbsencesFilter;
    let sorting: Sorting<keyof LessonPresenceStatistic>;

    beforeEach(() => {
      filter = {
        student: null,
        educationalEvent: null,
        studyClass: null,
      };

      sorting = {
        key: 'StudentFullName',
        ascending: true,
      };
    });

    it('fetches statistics based with the given filter (all filter criteria set) and sorting', () => {
      filter.student = 123;
      filter.educationalEvent = 333;
      filter.studyClass = 678;
      const url =
        'https://eventotest.api/LessonPresences/Statistics?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&sort=StudentFullName.asc&offset=0&limit=1000';

      service
        .getStatistics(filter, sorting, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);

      httpTestingController.verify();
    });

    it('fetches statistics based with the given filter (only student set) and sorting', () => {
      filter.student = 123;
      const url =
        'https://eventotest.api/LessonPresences/Statistics?filter.StudentRef==123&sort=StudentFullName.asc&offset=0&limit=1000';

      service
        .getStatistics(filter, sorting, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });
  });

  describe('.getLessonRefs', () => {
    const data: any[] = [];
    let filter: EvaluateAbsencesFilter;

    beforeEach(() => {
      filter = {
        student: null,
        educationalEvent: null,
        studyClass: null,
      };
    });

    it('fetches lesson refs with all filter values set', () => {
      filter.student = 123;
      filter.educationalEvent = 333;
      filter.studyClass = 678;

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&filter.TypeRef=%3E0&fields=LessonRef,RegistrationRef,StudentRef,EventRef,StudyClassRef,TypeRef';

      service
        .getLessonRefs(filter)
        .subscribe((result) => expect(result).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });

    it('fetches lesson refs with one filter value set', () => {
      filter.studyClass = 678;

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudyClassRef==678&filter.TypeRef=%3E0&fields=LessonRef,RegistrationRef,StudentRef,EventRef,StudyClassRef,TypeRef';

      service
        .getLessonRefs(filter)
        .subscribe((result) => expect(result).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });
  });

  describe('.getFilteredList', () => {
    const data: any[] = [];
    let filter: EditAbsencesFilter;

    beforeEach(() => {
      filter = {
        student: null,
        educationalEvent: null,
        studyClass: null,
        teacher: null,
        dateFrom: null,
        dateTo: null,
        presenceTypes: null,
        confirmationStates: null,
        incidentTypes: null,
      };
    });

    it('fetches lesson presences with the given basic filters', () => {
      filter.student = 123;
      filter.educationalEvent = 333;
      filter.studyClass = 678;

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });

    it('fetches lesson presences with all given filters', () => {
      filter.student = 123;
      filter.educationalEvent = 333;
      filter.studyClass = 678;
      filter.teacher = 'Bandi Victor';
      filter.dateFrom = new Date(2000, 0, 23);
      filter.dateTo = new Date(2000, 0, 25);
      filter.presenceTypes = [888];
      filter.confirmationStates = [999];

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&filter.TeacherInformation=~*Bandi%20Victor*&filter.LessonDateTimeFrom=%3E2000-01-22&filter.LessonDateTimeTo=%3C2000-01-26&filter.ConfirmationStateId=;999&filter.TypeRef=;888&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });

    it('fetches lesson presences with with only date from', () => {
      filter.dateFrom = new Date(2000, 0, 23);

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom=%3E2000-01-22&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });

    it('fetches lesson presences with with only date to', () => {
      filter.dateTo = new Date(2000, 0, 25);

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeTo=%3C2000-01-26&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });

    it('fetches lesson presences with with equal date from/to', () => {
      filter.dateFrom = new Date(2000, 0, 23);
      filter.dateTo = new Date(2000, 0, 23);

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==2000-01-23&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });

    it('fetches lesson presences with additional sort params', () => {
      const additionalParams: Dict<string> = {
        sort: 'StudentFullName.asc,LessonDateTimeFrom.asc',
      };
      filter.educationalEvent = 333;

      const url =
        'https://eventotest.api/LessonPresences/?sort=StudentFullName.asc,LessonDateTimeFrom.asc&filter.EventRef==333&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0, additionalParams)
        .subscribe((result) => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(data);
      httpTestingController.verify();
    });
  });

  describe('.hasLessonsLessonTeacher', () => {
    let url =
      'https://eventotest.api/LessonPresences/?fields=Id&offset=0&limit=1';

    it('returns true if a lesson teacher has at least on lesson presence', () => {
      service
        .hasLessonsLessonTeacher()
        .subscribe((result) => expect(result).toBeTrue());

      httpTestingController
        .expectOne(
          (req) =>
            req.urlWithParams === url &&
            req.headers.get('X-Role-Restriction') === 'LessonTeacherRole',
          url
        )
        .flush([{ Id: '197116_5597' }]);
      httpTestingController.verify();
    });

    it('returns false if a lesson teacher has no lesson presences', () => {
      service
        .hasLessonsLessonTeacher()
        .subscribe((result) => expect(result).toBeFalse());

      httpTestingController
        .expectOne(
          (req) =>
            req.urlWithParams === url &&
            req.headers.get('X-Role-Restriction') === 'LessonTeacherRole',
          url
        )
        .flush([]);
      httpTestingController.verify();
    });
  });

  describe('.checkableAbsencesCount', () => {
    it('returns one given one checkable absence id', () => {
      service
        .checkableAbsencesCount()
        .subscribe((result) => expect(result).toBe(1));

      httpTestingController
        .expectOne(
          (req) =>
            req.urlWithParams ===
              'https://eventotest.api/LessonPresences/?filter.ConfirmationStateId=;1080&fields=Id,ConfirmationStateId' &&
            req.headers.get('X-Role-Restriction') === 'LessonTeacherRole'
        )
        .flush([{ Id: '197116_5597' }]);
      httpTestingController.verify();
    });
  });
});
