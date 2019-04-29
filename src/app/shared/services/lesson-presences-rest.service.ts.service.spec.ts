import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonPresencesRestService } from './lesson-presences-rest.service.ts.service';

describe('LessonPresencesRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: LessonPresencesRestService = TestBed.get(
      LessonPresencesRestService
    );
    expect(service).toBeTruthy();
  });
});
