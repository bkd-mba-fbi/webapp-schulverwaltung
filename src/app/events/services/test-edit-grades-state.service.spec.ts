import { TestBed } from '@angular/core/testing';

import { TestEditGradesStateService } from './test-edit-grades-state.service';
import { buildTestModuleMetadata } from '../../../spec-helpers';

describe('TestEditGradesStateService', () => {
  let service: TestEditGradesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(TestEditGradesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
