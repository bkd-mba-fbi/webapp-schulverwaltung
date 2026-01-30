/// <reference types="@angular/localize" />
import { registerLocaleData } from "@angular/common";
import localeDECH from "@angular/common/locales/de-CH";
import localeFRCH from "@angular/common/locales/fr-CH";
import { enableProdMode, provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDECH);
registerLocaleData(localeFRCH);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [provideZoneChangeDetection(), ...appConfig.providers],
}).catch((err) => console.error(err));
