import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SettingsService, Settings } from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('.settings$', () => {
    let settingsMock: Settings;
    let next: jasmine.Spy;
    let error: jasmine.Spy;
    let complete: jasmine.Spy;
    beforeEach(() => {
      settingsMock = {
        apiUrl: 'https://example.com/api',
        latePresenceTypeId: 12
      };

      next = jasmine.createSpy('next');
      error = jasmine.createSpy('error');
      complete = jasmine.createSpy('complete');
    });

    afterEach(() => resetSettings());

    it('emits settings object', () => {
      setSettings(settingsMock);
      const service: SettingsService = TestBed.get(SettingsService);

      service.settings$.subscribe(next, error, complete);
      expect(next).toHaveBeenCalledWith(settingsMock);
      expect(error).not.toHaveBeenCalled();
      expect(complete).toHaveBeenCalled();
    });

    it('emits settings object, when available after 2s', fakeAsync(() => {
      const service: SettingsService = TestBed.get(SettingsService);
      service.settings$.subscribe(next, error, complete);
      expect(next).not.toHaveBeenCalled();

      tick(1000);
      expect(next).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();

      tick(1000);
      expect(next).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
      expect(complete).not.toHaveBeenCalled();

      setSettings(settingsMock);
      tick(1000);
      expect(next).toHaveBeenCalledWith(settingsMock);
      expect(error).not.toHaveBeenCalled();
      expect(complete).toHaveBeenCalled();
    }));

    it('throws error when settings loading failed or not defined', fakeAsync(() => {
      const service: SettingsService = TestBed.get(SettingsService);
      service.settings$.subscribe(next, error, complete);
      expect(next).not.toHaveBeenCalled();

      tick(6000);
      expect(next).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalled();
      expect(error.calls.mostRecent().args[0].toString()).toEqual(
        'Error: Settings not available'
      );
      expect(complete).not.toHaveBeenCalled();
    }));
  });

  describe('apiUrl$', () => {
    it('returns apiUrl', () => {
      setSettings({
        apiUrl: 'https://example.com/api',
        latePresenceTypeId: 12
      });
      const service: SettingsService = TestBed.get(SettingsService);
      const callback = jasmine.createSpy('callback');
      service.apiUrl$.subscribe(callback);
      expect(callback).toHaveBeenCalledWith('https://example.com/api');
    });
  });

  function setSettings(settings: Settings): void {
    (window as any).absenzenmanagement = { settings };
  }

  function resetSettings(): void {
    (window as any).absenzenmanagement = undefined;
  }
});
