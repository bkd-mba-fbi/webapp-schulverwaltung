import { TestBed } from '@angular/core/testing';

import { LessonTeachersRestService } from './lesson-teachers-rest.service';
import { buildTestModuleMetadata } from '../../../spec-helpers';

describe('LessonTeachersService', () => {
  let service: LessonTeachersRestService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(LessonTeachersRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
