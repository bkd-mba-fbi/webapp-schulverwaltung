import { TestBed } from '@angular/core/testing';

import { LessonIncidentsRestService } from './lesson-incidents-rest.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('LessonIncidentsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: LessonIncidentsRestService = TestBed.inject(
      LessonIncidentsRestService
    );
    expect(service).toBeTruthy();
  });
});
