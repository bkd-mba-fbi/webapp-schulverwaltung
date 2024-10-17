import { Injectable, LOCALE_ID, Provider } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StorageService } from "./storage.service";

const LANGUAGES: ReadonlyArray<string> = ["de-CH", "fr-CH"];
const FALLBACK_LANGUAGE = LANGUAGES[0];

export function provideDetectedLocale(): Provider[] {
  return [
    {
      provide: LOCALE_ID,
      useFactory: (i18nService: I18nService) => i18nService.detectLanguage(),
      deps: [I18nService],
    },
  ];
}

@Injectable({
  providedIn: "root",
})
export class I18nService {
  constructor(
    private translate: TranslateService,
    private storage: StorageService,
  ) {}

  private detectedLanguage: Option<string>;

  initialize(): void {
    this.translate.setDefaultLang(FALLBACK_LANGUAGE);
    this.translate.use(this.detectLanguage());
  }

  /**
   * Detect the user's language using the following priorities:
   *   1. Document's HTML lang attribute
   *   2. Language provided in localStorage
   *   3. Browser's language
   *   4. Fallback language
   */
  detectLanguage(): string {
    if (!this.detectedLanguage) {
      this.detectedLanguage =
        this.getDocumentLanguage() ||
        this.getStoredLanguage() ||
        this.getBrowserLanguage() ||
        FALLBACK_LANGUAGE;
    }

    return this.detectedLanguage;
  }

  getLocalizedLanguage(language: Maybe<string>): string {
    language = LANGUAGES.find(
      (l) => l === `${(language || "").toLowerCase()}-CH`,
    );
    return language ? language : FALLBACK_LANGUAGE;
  }

  private getDocumentLanguage(): Option<string> {
    const langElement = document.querySelector<HTMLElement>("[lang]");
    return this.normalizeLanguage(langElement && langElement.lang);
  }

  private getStoredLanguage(): Option<string> {
    return this.normalizeLanguage(this.storage.getLanguage());
  }

  private getBrowserLanguage(): Option<string> {
    return this.normalizeLanguage(this.translate.getBrowserLang());
  }

  private normalizeLanguage(lang: Maybe<string>): Option<string> {
    lang = (lang || "").split("-")[0];
    return (lang && LANGUAGES.find((l) => lang === l.split("-")[0])) || null;
  }
}
