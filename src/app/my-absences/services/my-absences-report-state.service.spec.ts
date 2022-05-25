import { TestBed } from '@angular/core/testing';

import { MyAbsencesReportStateService } from './my-absences-report-state.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('MyAbsencesReportStateService', () => {
  let service: MyAbsencesReportStateService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          MyAbsencesReportStateService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): Option<object> {
                return { id_person: '42' };
              },
            },
          },
        ],
      })
    );
    service = TestBed.inject(MyAbsencesReportStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
