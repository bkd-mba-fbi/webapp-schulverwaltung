import { TestBed } from '@angular/core/testing';

import { EditAbsencesUpdateService } from './edit-absences-update.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('EditAbsencesUpdateService', () => {
  let service: EditAbsencesUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule(buildTestModuleMetadata({}));
    service = TestBed.inject(EditAbsencesUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
