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
    const id = 123;
    const value = 4.5;

    // when
    service
      .updateGrade(id, value)
      .subscribe((result) => expect(result).toEqual(id));

    // then
    httpTestingController
      .expectOne(
        ({ method, url, body }) =>
          method === 'PUT' &&
          url === `https://eventotest.api/Gradings/${id}` &&
          isEqual(body, { IdGrade: 123, GradeValue: 4.5 })
      )
      .flush(id);
  });
});
