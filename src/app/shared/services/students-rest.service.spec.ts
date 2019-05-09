import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentsRestService } from './students-rest.service';
import { LegalRepresentative } from '../models/legal-representative.model';
import { HttpTestingController } from '@angular/common/http/testing';

describe('StudentsRestService', () => {
  let service: StudentsRestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata());
    service = TestBed.get(StudentsRestService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('.getLegalRepresentatives', () => {
    it('requests the legal representatives of a given student', () => {
      service.getLegalRepresentatives(39361).subscribe(result => {
        expect(result).toEqual([
          LegalRepresentative.from({ id: 54425 }),
          LegalRepresentative.from({ id: 56200 })
        ]);
      });

      httpTestingController
        .expectOne('https://eventotest.api/Students/39361/LegalRepresentatives')
        .flush([{ id: 54425 }, { id: 56200 }]);
    });
  });
});
