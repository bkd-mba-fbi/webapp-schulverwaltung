import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentsRestService } from './students-rest.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { ApprenticeshipContract } from '../models/apprenticeship-contract.model';

describe('StudentsRestService', () => {
  let service: StudentsRestService;
  let httpTestingController: HttpTestingController;
  let date: Date;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.get(StudentsRestService);
    httpTestingController = TestBed.get(HttpTestingController);

    date = new Date();
  });

  afterEach(() => httpTestingController.verify());

  describe('.getLegalRepresentatives', () => {
    it('should request the legal representatives of a given student', () => {
      service.getLegalRepresentatives(39361).subscribe(result => {
        expect(result).toEqual([buildModel(54425), buildModel(56200)]);
      });

      httpTestingController
        .expectOne('https://eventotest.api/Students/39361/LegalRepresentatives')
        .flush([buildModel(54425, false), buildModel(56200, false)]);
    });

    function buildModel(id: number, useDate = true): any {
      const ref = {
        Id: 123,
        Href: ''
      };
      const dateValue = useDate ? date : date.toISOString();
      return {
        Id: id,
        RepresentativeRef: ref,
        StudentRef: ref,
        DateFrom: dateValue,
        DateTo: dateValue,
        RepresentativeAfterMajority: 0,
        Href: ''
      };
    }
  });

  describe('.getCurrentApprenticeshipContract', () => {
    it('should request the current apprenticeship contract of a given student', () => {
      service.getCurrentApprenticeshipContract(39361).subscribe(result => {
        expect(result).toEqual(buildModel(55905));
      });

      httpTestingController
        .expectOne(
          'https://eventotest.api/Students/39361/ApprenticeshipContracts/Current'
        )
        .flush(buildModel(55905));
    });

    function buildModel(id: number): ApprenticeshipContract {
      const ref = {
        Id: 456,
        Href: ''
      };
      return {
        Id: id,
        JobTrainerRef: ref,
        StudentRef: ref,
        ApprenticeshipManagerId: id,
        ApprenticeshipDateFrom: '2018-08-06',
        ApprenticeshipDateTo: '2021-08-05',
        CompanyName: 'Firma',
        ContractDateFrom: null,
        ContractDateTo: null,
        ContractNumber: '123456789',
        ContractTermination: null,
        ContractType: 100,
        JobCode: 0,
        JobVersion: 1,
        Href: ''
      };
    }
  });
});
