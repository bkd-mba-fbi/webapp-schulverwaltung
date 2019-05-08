import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { LessonAbsencesRestService } from './lesson-absences-rest.service';

describe('LessonAbsencesRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: LessonAbsencesRestService = TestBed.get(
      LessonAbsencesRestService
    );
    expect(service).toBeTruthy();
  });
});
