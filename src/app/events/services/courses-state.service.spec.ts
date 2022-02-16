import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { CoursesStateService } from './courses-state.service';

describe('CoursesStateService', () => {
  let service: CoursesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [CoursesStateService] })
    );
    service = TestBed.inject(CoursesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
