import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

describe('I18nService', () => {
  let service: I18nService;
  let translateMock: TranslateService;
  let storageMock: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslateService,
          useValue: jasmine.createSpyObj('TranslateService', [
            'setDefaultLang',
            'use',
            'getBrowserLang'
          ])
        },
        {
          provide: StorageService,
          useValue: jasmine.createSpyObj('StorageService', ['getLanguage'])
        }
      ]
    });
    service = TestBed.get(I18nService);
    translateMock = TestBed.get(TranslateService);
    storageMock = TestBed.get(StorageService);
  });

  afterEach(() => {
    // Reset HTML lang attribute even if test fails
    setHtmlLang('');
  });

  it('does not set languages on construction', () => {
    expect(translateMock.setDefaultLang).not.toHaveBeenCalled();
    expect(translateMock.use).not.toHaveBeenCalled();
  });

  describe('.initialize', () => {
    describe('by document language', () => {
      it('returns "fr" if document language is "fr"', () => {
        setHtmlLang('fr');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('fr-CH');
      });

      it('returns "fr" if document language is "fr-FR"', () => {
        setHtmlLang('fr-FR');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('fr-CH');
      });

      it('returns fallback language if document language is "en"', () => {
        setHtmlLang('en');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('de-CH');
      });
    });

    describe('by stored language', () => {
      it('returns "fr" if stored language is "fr"', () => {
        (storageMock.getLanguage as jasmine.Spy).and.returnValue('fr');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('fr-CH');
      });

      it('returns "fr" if stored language is "fr-FR"', () => {
        (storageMock.getLanguage as jasmine.Spy).and.returnValue('fr-FR');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('fr-CH');
      });

      it('returns fallback language if stored language is "en"', () => {
        (storageMock.getLanguage as jasmine.Spy).and.returnValue('en');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('de-CH');
      });
    });

    describe('by browser language', () => {
      it('returns "fr" if browser language is "fr"', () => {
        (translateMock.getBrowserLang as jasmine.Spy).and.returnValue('fr');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('fr-CH');
      });

      it('returns "fr" if browser language is "fr-FR"', () => {
        (translateMock.getBrowserLang as jasmine.Spy).and.returnValue('fr-FR');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('fr-CH');
      });

      it('returns fallback language if browser language is "en"', () => {
        (translateMock.getBrowserLang as jasmine.Spy).and.returnValue('en');
        service.initialize();
        expect(translateMock.setDefaultLang).toHaveBeenCalledWith('de-CH');
        expect(translateMock.use).toHaveBeenCalledWith('de-CH');
      });
    });
  });

  function setHtmlLang(lang: string): void {
    (document.firstElementChild as HTMLElement).lang = lang;
  }
});
