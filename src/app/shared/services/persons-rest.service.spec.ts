import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PersonsRestService } from './persons-rest.service';
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
      service.getListForIds([38608, 38610]).subscribe(result => {
        expect(result).toEqual([buildModel(38608), buildModel(38610)]);
      });

      // TODO how to test urls with parameters?
      // httpTestingController.expectOne(
      //   'https://eventotest.api/Persons?filter.Id=;38608;38610'
      // );
      // .flush([buildModel(38608), buildModel(38610)]);

      httpTestingController
        .expectOne(req => req.url === 'https://eventotest.api/Persons')
        .flush([buildModel(38608), buildModel(38610)]);
    });

    function buildModel(id: number): Person {
      return {
        Id: id,
        Country: 'Schweiz',
        CountryId: 'CH',
        FormOfAddress: 'Frau',
        FormOfAddressId: 2,
        HomeCountry: null,
        HomeCountryId: null,
        Nationality: null,
        NationalityId: null,
        AddressLine1: null,
        AddressLine2: null,
        BillingAddress: '',
        Birthdate: null,
        CorrespondenceAddress: '',
        DisplayEmail: null,
        Email: null,
        Email2: null,
        FirstName: 'First',
        Gender: 'F',
        HomeTown: null,
        IsEditable: true,
        IsEmployee: false,
        LastName: 'Last',
        Location: null,
        MatriculationNumber: null,
        MiddleName: null,
        NativeLanguage: null,
        PhoneMobile: null,
        PhonePrivate: null,
        Profession: null,
        SocialSecurityNumber: null,
        StayPermit: null,
        StayPermitExpiry: null,
        Zip: null,
        Href: ''
      };
    }
  });
});
