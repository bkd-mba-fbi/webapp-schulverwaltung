import { TestBed } from '@angular/core/testing';

import { TestEditGradesStateService } from './test-edit-grades-state.service';

describe('TestEditGradesStateService', () => {
  let service: TestEditGradesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestEditGradesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
