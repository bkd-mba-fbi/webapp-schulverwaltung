import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeDECH from '@angular/common/locales/de-CH';
import localeFRCH from '@angular/common/locales/fr-CH';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './global-error-handler';
import { HomeComponent } from './home.component';
import { MyNotificationsShowComponent } from './my-notifications/components/my-notifications-show/my-notifications-show.component';
import { MyNotificationsService } from './my-notifications/services/my-notifications.service';
import { Settings, SETTINGS } from './settings';
import { I18nService } from './shared/services/i18n.service';
import { SharedModule } from './shared/shared.module';
import { UnauthenticatedComponent } from './unauthenticated.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(
  http: HttpClient,
  settings: Settings
): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    `${settings.scriptsAndAssetsPath}/assets/locales/`,
    '.json'
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
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, SETTINGS],
      },
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    SharedModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: LOCALE_ID,
      useFactory: (i18nService: I18nService) => i18nService.detectLanguage(),
      deps: [I18nService],
    },
    MyNotificationsService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [MyNotificationsShowComponent],
})
export class AppModule {}
