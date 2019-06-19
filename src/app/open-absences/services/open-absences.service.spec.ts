import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { OpenAbsencesService } from './open-absences.service';

describe('OpenAbsencesService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: OpenAbsencesService = TestBed.get(OpenAbsencesService);
    expect(service).toBeTruthy();
  });
});
