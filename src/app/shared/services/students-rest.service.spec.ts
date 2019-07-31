import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentsRestService } from './students-rest.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { buildApprenticeshipContract } from 'src/spec-builders';

describe('StudentsRestService', () => {
  let service: StudentsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.get(StudentsRestService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('.getLegalRepresentatives', () => {
    it('should request the legal representatives of a given student', () => {
      service.getLegalRepresentatives(39361).subscribe(result => {
        expect(result).toEqual([buildModel(54425), buildModel(56200)]);
      });

      httpTestingController
        .expectOne('https://eventotest.api/Students/39361/LegalRepresentatives')
        .flush([buildModel(54425), buildModel(56200)]);
    });

    function buildModel(id: number): any {
      return {
        Id: id,
        RepresentativeId: 123
      };
    }
  });

  describe('.getCurrentApprenticeshipContracts', () => {
    it('should request the current apprenticeship contracts of a given student', () => {
      service.getCurrentApprenticeshipContracts(39361).subscribe(result => {
        expect(result).toEqual([
          buildApprenticeshipContract(55905),
          buildApprenticeshipContract(55906)
        ]);
      });

      httpTestingController
        .expectOne(
          'https://eventotest.api/Students/39361/ApprenticeshipContracts/Current'
        )
        .flush([
          buildApprenticeshipContract(55905),
          buildApprenticeshipContract(55906)
        ]);
    });
  });
});
