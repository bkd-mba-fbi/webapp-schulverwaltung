import { TestBed } from '@angular/core/testing';

import { PresenceTypesService } from './presence-types.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('PresenceTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: PresenceTypesService = TestBed.get(PresenceTypesService);
    expect(service).toBeTruthy();
  });
});
