import { TestBed } from '@angular/core/testing';

import { LegalRepresentativesRestService } from './legal-representatives-rest.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('LegalRepresentativesRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: LegalRepresentativesRestService = TestBed.get(
      LegalRepresentativesRestService
    );
    expect(service).toBeTruthy();
  });
});
