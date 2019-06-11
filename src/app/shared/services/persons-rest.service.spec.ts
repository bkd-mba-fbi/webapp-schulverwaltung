import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PersonsRestService } from './persons-rest.service';
import { buildPerson } from 'src/spec-builders';
import { Person } from '../models/person.model';

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

      const url = 'https://eventotest.api/Persons?filter.Id=;38608;38610';
      httpTestingController
        .expectOne(req => req.urlWithParams === url, url)
        .flush(t.array(Person).encode(persons));
    });
  });
});
