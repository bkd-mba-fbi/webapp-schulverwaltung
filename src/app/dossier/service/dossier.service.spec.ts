import { TestBed } from '@angular/core/testing';

import { DossierService } from './dossier.service';

describe('DossierService', () => {
  let service: DossierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
