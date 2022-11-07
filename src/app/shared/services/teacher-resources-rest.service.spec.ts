import { TestBed } from '@angular/core/testing';

import { TeacherResourcesRestService } from './teacher-resources-rest.service';
import { buildTestModuleMetadata } from '../../../spec-helpers';

describe('TeacherResourcesTestService', () => {
  let service: TeacherResourcesRestService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(TeacherResourcesRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
