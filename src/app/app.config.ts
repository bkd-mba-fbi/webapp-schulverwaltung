import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter, withHashLocation } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { routes } from "./app.routes";
import { SETTINGS, Settings } from "./settings";
import { restAuthInterceptor } from "./shared/interceptors/rest-auth.interceptor";
import { restErrorInterceptor } from "./shared/interceptors/rest-error.interceptor";
import { restRoleInterceptor } from "./shared/interceptors/rest-role.interceptor";
import { provideGlobalErrorHandler } from "./shared/services/global-error-handler";
import { provideDetectedLocale } from "./shared/services/i18n.service";

// AoT requires an exported function for factories
export function HttpLoaderFactory(
  http: HttpClient,
  settings: Settings,
): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `${settings.scriptsAndAssetsPath}/assets/locales/`,
    ".json",
  );
}

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
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient, SETTINGS],
        },
      }),
    ),
    provideDetectedLocale(),
  ],
};
