import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { PersonsRestService } from './persons-rest.service';

describe('PersonsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: PersonsRestService = TestBed.get(PersonsRestService);
    expect(service).toBeTruthy();
  });
});
