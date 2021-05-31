import { TestBed } from '@angular/core/testing';
import { isEqual } from 'lodash-es';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresencesUpdateRestService } from './lesson-presences-update-rest.service';
import { HttpTestingController } from '@angular/common/http/testing';

describe('LessonPresencesUpdateRestService', () => {
  let service: LessonPresencesUpdateRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(LessonPresencesUpdateRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.editLessonPresences', () => {
    it('executes PUT request with JSON body', () => {
      service
        .editLessonPresences([1, 2, 3], [4, 5, 6], 10, 20)
        .subscribe((result) => {
          expect(result).toBeUndefined();
        });

      expectRequestWithBody('https://eventotest.api/LessonPresences/Edit', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
        PresenceTypeId: 10,
        ConfirmationValue: 20,
      });
    });

    it('executes PUT request with JSON body with explicit null values', () => {
      service
        .editLessonPresences([1, 2, 3], [4, 5, 6], null, null)
        .subscribe((result) => {
          expect(result).toBeUndefined();
        });

      expectRequestWithBody('https://eventotest.api/LessonPresences/Edit', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
        PresenceTypeId: null,
        ConfirmationValue: null,
      });
    });

    it('omits PresenceTypeId and ConfirmationValue if not set', () => {
      service.editLessonPresences([1, 2, 3], [4, 5, 6]).subscribe((result) => {
        expect(result).toBeUndefined();
      });

      expectRequestWithBody('https://eventotest.api/LessonPresences/Edit', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
      });
    });

    it('omits PresenceTypeId and ConfirmationValue if set to undefined', () => {
      service
        .editLessonPresences([1, 2, 3], [4, 5, 6], undefined, undefined)
        .subscribe((result) => {
          expect(result).toBeUndefined();
        });

      expectRequestWithBody('https://eventotest.api/LessonPresences/Edit', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
      });
    });
  });

  describe('.removeLessonPresences', () => {
    it('executes PUT request with JSON body', () => {
      service
        .removeLessonPresences([1, 2, 3], [4, 5, 6])
        .subscribe((result) => {
          expect(result).toBeUndefined();
        });

      expectRequestWithBody('https://eventotest.api/LessonPresences/Reset', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
        WithComment: true,
      });
    });
  });

  describe('.confirmLessonPresences', () => {
    it('executes PUT request with JSON body', () => {
      service
        .confirmLessonPresences([1, 2, 3], [4, 5, 6], 11, 220)
        .subscribe((result) => {
          expect(result).toBeUndefined();
        });

      expectRequestWithBody('https://eventotest.api/LessonAbsences/Confirm', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
        AbsenceTypeId: 11,
        ConfirmationValue: 220,
      });
    });
  });

  function expectRequestWithBody(
    url: string,
    body: any,
    result: any = {}
  ): void {
    httpTestingController
      .expectOne(
        (req) => req.urlWithParams === url && isEqual(req.body, body),
        url
      )
      .flush(result);
  }
});
