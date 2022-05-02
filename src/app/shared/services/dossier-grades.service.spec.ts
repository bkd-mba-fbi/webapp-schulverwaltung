import { TestBed } from '@angular/core/testing';

import { DossierGradesService } from './dossier-grades.service';

describe('DossierGradesService', () => {
  let service: DossierGradesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierGradesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
