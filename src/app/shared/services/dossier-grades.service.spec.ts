import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { DossierGradesService } from './dossier-grades.service';

describe('DossierGradesService', () => {
  let service: DossierGradesService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(DossierGradesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
