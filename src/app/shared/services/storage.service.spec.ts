import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let storeMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(StorageService);

    storeMock = {};
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

  describe('.getAccessToken', () => {
    it('returns null if no value is available', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('returns value', () => {
      storeMock['CLX.LoginToken'] = 'asdf';
      expect(service.getAccessToken()).toBe('asdf');
    });

    it('returns value with trailing double quotes removed', () => {
      storeMock['CLX.LoginToken'] = '"asdf"';
      expect(service.getAccessToken()).toBe('asdf');
    });
  });

  describe('.getRefreshToken', () => {
    it('returns null if no value is available', () => {
      expect(service.getRefreshToken()).toBeNull();
    });

    it('returns value', () => {
      storeMock['CLX.RefreshToken'] = 'asdf';
      expect(service.getRefreshToken()).toBe('asdf');
    });
  });

  describe('.getTokenExpire', () => {
    it('returns null if no value is available', () => {
      expect(service.getTokenExpire()).toBeNull();
    });

    it('returns value', () => {
      storeMock['CLX.TokenExpire'] = 'asdf';
      expect(service.getTokenExpire()).toBe('asdf');
    });
  });
});
