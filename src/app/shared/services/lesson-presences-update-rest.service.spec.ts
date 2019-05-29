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
    service = TestBed.get(LessonPresencesUpdateRestService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.editLessonPresences', () => {
    it('executes PUT request with JSON body', () => {
      service
        .editLessonPresences([1, 2, 3], [4, 5, 6], 10, 20)
        .subscribe(result => {
          expect(result).toBeUndefined();
        });

      expectRequestWithBody('https://eventotest.api/BulkEditLessonPresence', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6],
        AbsenceTypeId: 10,
        ConfirmationValue: 20
      });
    });

    it('omits AbsenceTypeId and ConfirmationValue if not set', () => {
      service.editLessonPresences([1, 2, 3], [4, 5, 6]).subscribe(result => {
        expect(result).toBeUndefined();
      });

      expectRequestWithBody('https://eventotest.api/BulkEditLessonPresence', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6]
      });
    });
  });

  describe('.removeLessonPresences', () => {
    it('executes PUT request with JSON body', () => {
      service.removeLessonPresences([1, 2, 3], [4, 5, 6]).subscribe(result => {
        expect(result).toBeUndefined();
      });

      expectRequestWithBody('https://eventotest.api/BulkResetLessonPresence', {
        LessonIds: [1, 2, 3],
        PersonIds: [4, 5, 6]
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
        req => req.urlWithParams === url && isEqual(req.body, body),
        url
      )
      .flush(result);
  }
});
