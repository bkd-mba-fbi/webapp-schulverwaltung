import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/shared/services/storage.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

import { EventsStateService } from './events-state.service';

describe('EventsStateService', () => {
  let service: EventsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          EventsStateService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { roles: '' };
              },
            },
          },
        ],
      })
    );
    service = TestBed.inject(EventsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
