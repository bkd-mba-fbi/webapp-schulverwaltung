import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const storeMock: any = {};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(StorageService);

    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => storeMock[key] || null
    );
  });

  describe('.getLanguage', () => {
    it('returns null if no value is available', () => {
      expect(service.getLanguage()).toBeNull();
    });

    it('returns value', () => {
      storeMock.uiCulture = 'de-CH';
      expect(service.getLanguage()).toBe('de-CH');
    });
  });
});
