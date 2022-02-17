import { TestBed } from '@angular/core/testing';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { EventsStateService } from './events-state.service';

describe('EventsStateService', () => {
  let service: EventsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({ providers: [EventsStateService] })
    );
    service = TestBed.inject(EventsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
