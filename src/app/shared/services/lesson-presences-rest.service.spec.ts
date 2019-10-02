import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresencesRestService } from './lesson-presences-rest.service';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';
import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';

describe('LessonPresencesRestService', () => {
  let service: LessonPresencesRestService;
  let httpTestingController: HttpTestingController;
  let storeMock: any;
  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.get(LessonPresencesRestService);
    httpTestingController = TestBed.get(HttpTestingController);

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
      HRef: ''
    };
    const data: Readonly<any> = {
      Id: '1',
      LessonRef: ref,
      StudentRef: ref,
      EventRef: ref,
      TypeRef: { Id: null, HRef: null },
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
      TeacherInformation: ''
    };

    it('decodes ISO date strings to date objects', () => {
      service.get(123).subscribe(result => {
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
    });
  });

  describe('.getListByDate', () => {
    it('fetches list filtered by given date', () => {
      const data: any[] = [];
      service
        .getListByDate(new Date(2000, 0, 23))
        .subscribe(result => expect(result).toBe(data));

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==2000-01-23';
      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });

  describe('.getListForToday', () => {
    it("fetches list filtered by today's date", () => {
      const data: any[] = [];
      service.getListForToday().subscribe(result => expect(result).toBe(data));

      const url = 'https://eventotest.api/LessonPresences/Today';
      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });

  describe('.getListOfUnconfirmedLessonTeacher', () => {
    it('fetches list for lesson teacher filtered by unconfirmed state from settings', () => {
      const data: any[] = [];
      service
        .getListOfUnconfirmedLessonTeacher()
        .subscribe(result => expect(result).toBe(data));

      const url =
        'https://eventotest.api/LessonPresences/?filter.TypeRef==11&filter.ConfirmationStateId==219&filter.HasStudyCourseConfirmationCode==false';
      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });

  describe('.getListOfUnconfirmedClassTeacher', () => {
    it('fetches list for class teacher filtered by unconfirmed state from settings', () => {
      storeMock['CLX.LoginToken'] =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJvYXV0aCIsImF1ZCI6Imh0dHBzOi8vZGV2NDIwMC8iLCJuYmYiOjE1NjkzOTM5NDMsImV4cCI6MTU2OTQwODM0MywidG9rZW5fcHVycG9zZSI6IlVzZXIiLCJzY29wZSI6IlR1dG9yaW5nIiwiY29uc3VtZXJfaWQiOiJkZXY0MjAwIiwidXNlcm5hbWUiOiJMMjQzMSIsImluc3RhbmNlX2lkIjoiR1ltVEVTVCIsImN1bHR1cmVfaW5mbyI6ImRlLUNIIiwicmVkaXJlY3RfdXJpIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIiwiaWRfbWFuZGFudCI6IjIxMCIsImlkX3BlcnNvbiI6IjI0MzEiLCJmdWxsbmFtZSI6IlRlc3QgUnVkeSIsInJvbGVzIjoiTGVzc29uVGVhY2hlclJvbGU7Q2xhc3NUZWFjaGVyUm9sZSIsInRva2VuX2lkIjoiMzc0OSJ9.9lDju5CIIUaISRSz0x8k-kcF7Q6IhN_6HEMOlnsiDRA';
      const data: any[] = [];
      service
        .getListOfUnconfirmedClassTeacher()
        .subscribe(result => expect(result).toBe(data));

      const url =
        'https://eventotest.api/LessonPresences/?filter.TypeRef==11&filter.ConfirmationStateId==219&filter.HasStudyCourseConfirmationCode==true';
      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });

  describe('.getStatistics', () => {
    const data: any[] = [];
    let filter: EvaluateAbsencesFilter;

    beforeEach(() => {
      filter = {
        student: null,
        moduleInstance: null,
        studyClass: null
      };
    });

    it('fetches statistics based with the given filter, all filter criteria set', () => {
      filter.student = 123;
      filter.moduleInstance = 333;
      filter.studyClass = 678;
      const url =
        'https://eventotest.api/LessonPresences/Statistics?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&offset=0&limit=1000';

      service
        .getStatistics(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });

    it('fetches statistics based with the given filter, only student set', () => {
      filter.student = 123;
      const url =
        'https://eventotest.api/LessonPresences/Statistics?filter.StudentRef==123&offset=0&limit=1000';

      service
        .getStatistics(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });

  describe('.getFilteredList', () => {
    const data: any[] = [];
    let filter: EditAbsencesFilter;

    beforeEach(() => {
      filter = {
        student: null,
        moduleInstance: null,
        studyClass: null,
        dateFrom: null,
        dateTo: null,
        presenceType: null,
        confirmationState: null
      };
    });

    it('fetches lesson presences with the given basic filters', () => {
      filter.student = 123;
      filter.moduleInstance = 333;
      filter.studyClass = 678;

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });

    it('fetches lesson presences with all given filters', () => {
      filter.student = 123;
      filter.moduleInstance = 333;
      filter.studyClass = 678;
      filter.dateFrom = new Date(2000, 0, 23);
      filter.dateTo = new Date(2000, 0, 25);
      filter.presenceType = 888;
      filter.confirmationState = 999;

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678&filter.TypeRef==888&filter.ConfirmationStateId==999&filter.LessonDateTimeFrom=%3E2000-01-22&filter.LessonDateTimeTo=%3C2000-01-26&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });

    it('fetches lesson presences with with only date from', () => {
      filter.dateFrom = new Date(2000, 0, 23);

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom=%3E2000-01-22&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });

    it('fetches lesson presences with with only date to', () => {
      filter.dateTo = new Date(2000, 0, 25);

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeTo=%3C2000-01-26&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });

    it('fetches lesson presences with with equal date from/to', () => {
      filter.dateFrom = new Date(2000, 0, 23);
      filter.dateTo = new Date(2000, 0, 23);

      const url =
        'https://eventotest.api/LessonPresences/?filter.LessonDateTimeFrom==2000-01-23&offset=0&limit=1000';

      service
        .getFilteredList(filter, 0)
        .subscribe(result => expect(result.entries).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });
});
