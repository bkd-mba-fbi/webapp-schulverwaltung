import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, inject } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import {
  NgbDateAdapter,
  NgbDateNativeAdapter,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbInputDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
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
import { DateParserFormatter } from "./shared/services/date-parser-formatter";
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
    provideGlobalErrorHandler(),
    provideTranslateService({
      loader: [
        {
          provide: TRANSLATE_HTTP_LOADER_CONFIG,
          useFactory: () => ({
            resources: [
              {
                prefix: `${inject(SETTINGS).scriptsAndAssetsPath}/assets/locales/`,
                suffix: ".json",
              },
            ],
          }),
        },
        {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        },
      ],
    }),
    provideDetectedLocale(),

    // ng-bootstrap Datepicker customization
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: NgbDateParserFormatter, useClass: DateParserFormatter },
    {
      provide: NgbDatepickerConfig,
      useFactory: () => {
        const config = new NgbDatepickerConfig();
        config.weekdays = "short";
        return config;
      },
    },
    {
      provide: NgbInputDatepickerConfig,
      useFactory: () => {
        const config = new NgbInputDatepickerConfig();
        config.weekdays = "short";
        return config;
      },
    },
  ],
};
