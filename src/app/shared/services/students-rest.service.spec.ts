import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentsRestService } from './students-rest.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { buildApprenticeshipContract } from 'src/spec-builders';

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
      const dateValue = useDate ? date : date.toISOString();
      return {
        Id: id,
        TypeId: '',
        RepresentativeId: 123,
        StudentId: 123,
        DateFrom: dateValue,
        DateTo: dateValue,
        RepresentativeAfterMajority: false
      };
    }
  });

  describe('.getCurrentApprenticeshipContract', () => {
    it('should request the current apprenticeship contract of a given student', () => {
      const apprenticeshipContract = buildApprenticeshipContract(55905);

      service.getCurrentApprenticeshipContract(39361).subscribe(result => {
        expect(result).toEqual(apprenticeshipContract);
      });

      httpTestingController
        .expectOne(
          'https://eventotest.api/Students/39361/ApprenticeshipContracts/Current'
        )
        .flush([apprenticeshipContract]);
    });
  });
});
