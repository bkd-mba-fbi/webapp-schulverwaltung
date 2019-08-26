import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresencesRestService } from './lesson-presences-rest.service';
import { EvaluateAbsencesFilter } from 'src/app/evaluate-absences/services/evaluate-absences-state.service';
import { EditAbsencesFilter } from 'src/app/edit-absences/services/edit-absences-state.service';

describe('LessonPresencesRestService', () => {
  let service: LessonPresencesRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.get(LessonPresencesRestService);
    httpTestingController = TestBed.get(HttpTestingController);
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

  describe('.getListOfUnconfirmed', () => {
    it('fetches list filtered by unconfirmed state from settings', () => {
      const data: any[] = [];
      service
        .getListOfUnconfirmed()
        .subscribe(result => expect(result).toBe(data));

      const url =
        'https://eventotest.api/LessonPresences/?filter.TypeRef==11&filter.ConfirmationStateId==219&filter.HasStudyCourseConfirmationCode==false';
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

    it('fetches statistics based on the given filter, all filter criteria set', () => {
      filter.student = { id: 123, label: 'Hans Muster' };
      filter.moduleInstance = { id: 333, label: 'Biologie' };
      filter.studyClass = { id: 678, label: 'D3b' };
      const url =
        'https://eventotest.api/LessonPresences/Statistics?filter.StudentRef==123&filter.ModuleInstanceRef==333&filter.StudyClassRef==678';

      service
        .getStatistics(filter)
        .subscribe(result => expect(result).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });

    it('fetches statistics based on the given filter, only student set', () => {
      filter.student = { id: 123, label: 'Hans Muster' };
      const url =
        'https://eventotest.api/LessonPresences/Statistics?filter.StudentRef==123';

      service
        .getStatistics(filter)
        .subscribe(result => expect(result).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });

  describe('.search', () => {
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

    it('fetches lesson presences on the given basic filters', () => {
      filter.student = { id: 123, label: 'Hans Muster' };
      filter.moduleInstance = { id: 333, label: 'Biologie' };
      filter.studyClass = { id: 678, label: 'D3b' };

      const url =
        'https://eventotest.api/LessonPresences/?filter.StudentRef==123&filter.EventRef==333&filter.StudyClassRef==678';

      service
        .getFilteredList(filter)
        .subscribe(result => expect(result).toBe(data));

      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });
});
