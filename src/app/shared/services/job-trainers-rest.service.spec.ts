import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from '../../../spec-helpers';

import { JobTrainersRestService } from './job-trainers-rest.service';

describe('JobTrainersRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
  });

  it('should be created', () => {
    const service: JobTrainersRestService = TestBed.inject(
      JobTrainersRestService,
    );
    expect(service).toBeTruthy();
  });
});
