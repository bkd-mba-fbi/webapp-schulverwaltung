import { TestBed } from '@angular/core/testing';

import { DossierStateService } from './dossier-state.service';

describe('DossierStateService', () => {
  let service: DossierStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DossierStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
