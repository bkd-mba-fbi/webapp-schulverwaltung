import { TestBed } from '@angular/core/testing';

import { ApprenticeshipContractsService } from './apprenticeship-contracts.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('ApprenticeshipContractsService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: ApprenticeshipContractsService = TestBed.get(
      ApprenticeshipContractsService
    );
    expect(service).toBeTruthy();
  });
});
