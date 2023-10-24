import { TestBed } from '@angular/core/testing';

import { MyProfileService } from './my-profile.service';
import { buildTestModuleMetadata } from 'src/spec-helpers';

describe('MyProfileService', () => {
  let service: MyProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      buildTestModuleMetadata({
        providers: [MyProfileService],
      }),
    );
    service = TestBed.inject(MyProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
