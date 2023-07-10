import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { buildTestModuleMetadata } from '../../../spec-helpers';
import { StorageService } from '../../shared/services/storage.service';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StorageService,
            useValue: {
              getPayload(): any {
                return { id_person: '123' };
              },
            },
          },
        ],
      })
    );
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
