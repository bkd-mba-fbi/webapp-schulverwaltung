import { TestBed } from '@angular/core/testing';

import { MyAbsencesService } from './my-absences.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StorageService } from 'src/app/shared/services/storage.service';

describe('MyAbsencesService', () => {
  let service: MyAbsencesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          MyAbsencesService,
          {
            provide: StorageService,
            useValue: {
              getPayload(): any {
                return { id_person: 123 };
              },
            },
          },
        ],
      })
    );
    service = TestBed.inject(MyAbsencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
