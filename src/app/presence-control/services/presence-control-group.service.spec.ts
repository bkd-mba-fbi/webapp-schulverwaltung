import { TestBed } from '@angular/core/testing';

import { PresenceControlGroupService } from './presence-control-group.service';

describe('PresenceControlGroupService', () => {
  let service: PresenceControlGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresenceControlGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
