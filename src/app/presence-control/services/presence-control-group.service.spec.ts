import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from '../../../spec-helpers';

import { PresenceControlGroupService } from './presence-control-group.service';

describe('PresenceControlGroupService', () => {
  let service: PresenceControlGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(PresenceControlGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
