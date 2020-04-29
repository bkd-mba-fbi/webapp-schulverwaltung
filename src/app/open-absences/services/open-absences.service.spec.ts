import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { OpenAbsencesService } from './open-absences.service';
import { LessonPresencesRestService } from 'src/app/shared/services/lesson-presences-rest.service';

describe('OpenAbsencesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [
          OpenAbsencesService,
          {
            provide: LessonPresencesRestService,
            useValue: {
              getListOfUnconfirmed(): any {
                return of([]);
              },
            },
          },
        ],
      })
    );
  });

  it('should be created', () => {
    const service: OpenAbsencesService = TestBed.inject(OpenAbsencesService);
    expect(service).toBeTruthy();
  });
});
