import { registerLocaleData } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import localeDECH from "@angular/common/locales/de-CH";
import localeFRCH from "@angular/common/locales/fr-CH";
import {
  ApplicationRef,
  DoBootstrap,
  ErrorHandler,
  Injector,
  LOCALE_ID,
  NgModule,
} from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GlobalErrorHandler } from "./global-error-handler";
import { HomeComponent } from "./home.component";
import { MyNotificationsShowComponent } from "./my-notifications/components/my-notifications-show/my-notifications-show.component";
import { Settings, SETTINGS } from "./settings";
import { I18nService } from "./shared/services/i18n.service";
import { SharedModule } from "./shared/shared.module";
import { UnauthenticatedComponent } from "./unauthenticated.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";

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

registerLocaleData(localeDECH);
registerLocaleData(localeFRCH);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthenticatedComponent,
    MyNotificationsShowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, SETTINGS],
      },
    }),
    SharedModule,
    NgSelectModule,
    FormsModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: LOCALE_ID,
      useFactory: (i18nService: I18nService) => i18nService.detectLanguage(),
      deps: [I18nService],
    },
  ],
  bootstrap: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const notificationsElement = createCustomElement(
      MyNotificationsShowComponent,
      { injector: this.injector },
    );
    customElements.define("erz-notifications", notificationsElement);

    const appElement = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define("erz-app", appElement);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngDoBootstrap(_appRef: ApplicationRef): void {}
}
