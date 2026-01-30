import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, inject } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withHashLocation } from "@angular/router";
import { TranslateLoader, provideTranslateService } from "@ngx-translate/core";
import {
  TRANSLATE_HTTP_LOADER_CONFIG,
  TranslateHttpLoader,
} from "@ngx-translate/http-loader";
import { routes } from "./app.routes";
import { SETTINGS } from "./settings";
import { restAuthInterceptor } from "./shared/interceptors/rest-auth.interceptor";
import { restErrorInterceptor } from "./shared/interceptors/rest-error.interceptor";
import { restRoleInterceptor } from "./shared/interceptors/rest-role.interceptor";
import { provideGlobalErrorHandler } from "./shared/services/global-error-handler";
import { provideDetectedLocale } from "./shared/services/i18n.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([
        restErrorInterceptor(),
        restAuthInterceptor(),
        restRoleInterceptor(),
      ]),
    ),
    provideAnimations(),
    provideGlobalErrorHandler(),
    provideTranslateService({
      loader: [
        {
          provide: TRANSLATE_HTTP_LOADER_CONFIG,
          useFactory: () => ({
            prefix: `${inject(SETTINGS).scriptsAndAssetsPath}/assets/locales/`,
            suffix: ".json",
          }),
        },
        {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        },
      ],
    }),
    provideDetectedLocale(),
  ],
};
