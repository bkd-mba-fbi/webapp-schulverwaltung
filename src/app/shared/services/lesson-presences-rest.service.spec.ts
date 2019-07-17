import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresencesRestService } from './lesson-presences-rest.service';

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
      Href: ''
    };
    const data: Readonly<any> = {
      LessonRef: ref,
      StudentRef: ref,
      EventRef: ref,
      PresenceTypeRef: null,
      StudyClassRef: ref,
      EventTypeId: 123,
      PresenceConfirmationState: null,
      PresenceConfirmationStateId: null,
      EventDesignation: '',
      EventNumber: '',
      HasStudyCourseConfirmationCode: 0,
      IsReadOnly: 0,
      LessonDateTimeFrom: '2019-04-25T07:45:00',
      LessonDateTimeTo: '2019-04-25T08:30:00',
      PresenceComment: null,
      PresenceDate: '2019-04-18',
      PresenceType: null,
      StudentFullName: '',
      StudyClassDesignation: '',
      StudyClassNumber: '',
      TeacherInformation: '',
      Href: ''
    };

    it('decodes ISO date strings to date objects', () => {
      service.get(123).subscribe(result => {
        expect(result.LessonDateTimeFrom).toEqual(
          new Date('2019-04-25T07:45:00')
        );
        expect(result.LessonDateTimeTo).toEqual(
          new Date('2019-04-25T08:30:00')
        );
        expect(result.PresenceDate).toEqual(new Date('2019-04-18'));
      });

      httpTestingController
        .expectOne('https://eventotest.api/LessonPresences/123/')
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

  describe('.getListOfUnconfirmed', () => {
    it('fetches list filtered by unconfirmed state from settings', () => {
      const data: any[] = [];
      service
        .getListOfUnconfirmed()
        .subscribe(result => expect(result).toBe(data));

      const url =
        'https://eventotest.api/LessonPresences?filter.TypeRef==11&filter.ConfirmationStateId==219&filter.HasStudyCourseConfirmationCode==false';
      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(data);
    });
  });
});
