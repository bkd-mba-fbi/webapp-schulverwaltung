import { TestBed } from '@angular/core/testing';

import { buildTestModuleMetadata } from 'src/spec-helpers';
import { DropDownItemsRestService } from './drop-down-items-rest.service';

describe('DropdownItemsRestService', () => {
  beforeEach(() => TestBed.configureTestingModule(buildTestModuleMetadata({})));

  it('should be created', () => {
    const service: DropDownItemsRestService = TestBed.inject(
      DropDownItemsRestService,
    );
    expect(service).toBeTruthy();
  });
});
