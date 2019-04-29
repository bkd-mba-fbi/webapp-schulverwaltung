import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentsRestService } from './students-rest.service';

describe('StudentsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata()));

  it('should be created', () => {
    const service: StudentsRestService = TestBed.get(StudentsRestService);
    expect(service).toBeTruthy();
  });
});
