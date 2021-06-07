import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import * as t from 'io-ts/lib/index';
import { isEqual } from 'lodash-es';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PersonsRestService } from './persons-rest.service';
import { buildPerson } from 'src/spec-builders';
import { Person } from '../models/person.model';

describe('PersonsRestService', () => {
  let service: PersonsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(PersonsRestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.getListForIds', () => {
    it('requests all the persons in the given list of ids', () => {
      const persons = [buildPerson(38608), buildPerson(38610)];

      service.getListForIds([38608, 38610]).subscribe((result) => {
        expect(result).toEqual(persons);
      });

      const url = 'https://eventotest.api/Persons/?filter.Id=;38608;38610';
      httpTestingController
        .expectOne((req) => req.urlWithParams === url, url)
        .flush(t.array(Person).encode(persons));
    });
  });

  describe('.getMyself', () => {
    it("requests the current user's person", () => {
      const person = buildPerson(38608);

      service.getMyself().subscribe((result) => {
        expect(result).toEqual(person);
      });

      const url = 'https://eventotest.api/Persons/me';
      httpTestingController.expectOne(url).flush(Person.encode(person));
    });
  });

  describe('.update', () => {
    it('updates the phone numbers and email', () => {
      service
        .update(
          38608,
          '+41 31 123 45 67',
          '+41 79 123 45 67',
          'john@example.com'
        )
        .subscribe();

      httpTestingController.match(
        (req) =>
          req.method === 'PUT' &&
          req.urlWithParams === 'https://eventotest.api/Persons/38608' &&
          isEqual(req.body, {
            PhonePrivate: '+41 31 123 45 67',
            PhoneMobile: '+41 79 123 45 67',
            Email2: 'john@example.com',
          })
      );
    });
  });

  describe('.getByIdWithEmailInfos', () => {
    it('returns the given person with only email information fields', () => {
      service.getByIdWithEmailInfos(4515).subscribe();

      httpTestingController.match(
        (req) =>
          req.method === 'GET' &&
          req.urlWithParams ===
            'https://eventotest.api/Persons/?filter.Id==4515&fields=FormOfAddress,Email'
      );
    });
  });
});
