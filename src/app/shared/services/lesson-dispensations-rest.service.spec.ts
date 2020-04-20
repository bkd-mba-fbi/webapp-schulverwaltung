import { TestBed } from '@angular/core/testing';

import { LessonDispensationsRestService } from './lesson-dispensations-rest.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('LessonDispensationsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: LessonDispensationsRestService = TestBed.inject(
      LessonDispensationsRestService
    );
    expect(service).toBeTruthy();
  });
});
