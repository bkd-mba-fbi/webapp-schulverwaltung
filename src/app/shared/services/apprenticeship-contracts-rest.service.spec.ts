import { TestBed } from '@angular/core/testing';

import { ApprenticeshipContractsRestService } from './apprenticeship-contracts-rest.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('ApprenticeshipContractsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: ApprenticeshipContractsRestService = TestBed.inject(
      ApprenticeshipContractsRestService
    );
    expect(service).toBeTruthy();
  });
});
