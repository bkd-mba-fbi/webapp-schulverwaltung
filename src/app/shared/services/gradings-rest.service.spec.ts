import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import isEqual from 'lodash-es/isEqual';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { GradingsRestService } from './gradings-rest.service';

describe('GradingsRestService', () => {
  let service: GradingsRestService;

  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(GradingsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update final grade and return grade id', () => {
    // given
    const gradeId = 123;
    const selectedGradeId = 5555;

    // when
    service
      .updateGrade(gradeId, selectedGradeId)
      .subscribe((result) => expect(result).toEqual(gradeId));

    // then
    httpTestingController
      .expectOne(
        ({ method, url, body }) =>
          method === 'PUT' &&
          url === `https://eventotest.api/Gradings/${gradeId}` &&
          isEqual(body, { GradeId: selectedGradeId }),
      )
      .flush(gradeId);
  });
});
