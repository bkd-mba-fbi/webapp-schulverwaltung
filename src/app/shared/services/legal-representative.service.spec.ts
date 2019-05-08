import { TestBed } from '@angular/core/testing';

import { LegalRepresentativeService } from './legal-representative.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('LegalRepresentativeService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: LegalRepresentativeService = TestBed.get(
      LegalRepresentativeService
    );
    expect(service).toBeTruthy();
  });
});
