import { TestBed } from '@angular/core/testing';

import { ReportsService } from './reports.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StorageService } from './storage.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          {
            provide: StorageService,
            useValue: {
              getAccessToken(): Option<string> {
                return 'SOMETOKEN';
              },
            },
          },
        ],
      })
    );
    service = TestBed.inject(ReportsService);
  });

  describe('personMasterDataReportUrl', () => {
    it('returns the report url', () => {
      expect(service.personMasterDataReportUrl).toBe(
        'https://eventotest.api/Files/CrystalReports/Praesenzinformation/290026?token=SOMETOKEN'
      );
    });
  });
});
