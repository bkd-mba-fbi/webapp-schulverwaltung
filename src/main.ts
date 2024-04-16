/// <reference types="@angular/localize" />
import { registerLocaleData } from "@angular/common";
import localeDECH from "@angular/common/locales/de-CH";
import localeFRCH from "@angular/common/locales/fr-CH";
import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import { environment } from "./environments/environment";

__webpack_public_path__ =
  window.schulverwaltung.settings.scriptsAndAssetsPath + "/";

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeDECH);
registerLocaleData(localeFRCH);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
