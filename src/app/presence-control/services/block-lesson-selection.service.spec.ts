import { TestBed } from '@angular/core/testing';

import { BlockLessonSelectionService } from './block-lesson-selection.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('BlockLessonSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: BlockLessonSelectionService = TestBed.get(
      BlockLessonSelectionService
    );
    expect(service).toBeTruthy();
  });
});
