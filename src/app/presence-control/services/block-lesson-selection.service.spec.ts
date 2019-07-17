import { TestBed } from '@angular/core/testing';

import { BlockLessonSelectionService } from './block-lesson-selection.service';

describe('BlockLessonSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlockLessonSelectionService = TestBed.get(
      BlockLessonSelectionService
    );
    expect(service).toBeTruthy();
  });
});
