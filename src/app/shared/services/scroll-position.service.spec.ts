import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { ScrollPositionService } from './scroll-position.service';

describe('ScrollPositionService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: ScrollPositionService = TestBed.get(ScrollPositionService);
    expect(service).toBeTruthy();
  });
});
