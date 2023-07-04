import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { buildTestModuleMetadata } from '../../../spec-helpers';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
