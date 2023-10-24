import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { StudentProfileAbsencesService } from './student-profile-absences.service';

describe('StudentProfileAbsencesService', () => {
  let service: StudentProfileAbsencesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [StudentProfileAbsencesService],
      }),
    );
    service = TestBed.inject(StudentProfileAbsencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
