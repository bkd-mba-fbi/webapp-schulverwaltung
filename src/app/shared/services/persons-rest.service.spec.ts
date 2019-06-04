import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PersonsRestService } from './persons-rest.service';
import { buildPerson } from 'src/spec-builders';

describe('PersonsRestService', () => {
  let service: PersonsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.get(PersonsRestService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.getListForIds', () => {
    it('should request all the persons in the given list of ids', () => {
      const persons = [buildPerson(38608), buildPerson(38610)];

      service.getListForIds([38608, 38610]).subscribe(result => {
        expect(result).toEqual(persons);
      });

      // TODO how to test urls with parameters?
      // httpTestingController.expectOne(
      //   'https://eventotest.api/Persons?filter.Id=;38608;38610'
      // );
      // .flush(persons);

      httpTestingController
        .expectOne(req => req.url === 'https://eventotest.api/Persons')
        .flush(persons);
    });
  });
});
