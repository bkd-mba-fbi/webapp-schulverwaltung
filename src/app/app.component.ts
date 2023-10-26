import { Component, ChangeDetectionStrategy, Inject } from "@angular/core";
import { catchError } from "rxjs/operators";
import { EMPTY } from "rxjs";

import { SETTINGS, Settings } from "./settings";
import { I18nService } from "./shared/services/i18n.service";
import { decode } from "./shared/utils/decode";
import { NAVIGATOR } from "./shared/tokens/dom-apis";
import { Router } from "@angular/router";
import { ToastService } from "./shared/services/toast.service";

@Component({
  template:
    '<erz-toast aria-live="polite" aria-atomic="true"></erz-toast><router-outlet></router-outlet>',
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private router: Router,
    i18n: I18nService,
    private toastService: ToastService,
    @Inject(SETTINGS) private settings: Settings,
    @Inject(NAVIGATOR) private navigator: Navigator,
  ) {
    this.router.initialNavigation();
    i18n.initialize();
    this.checkSettings();
  }

  private checkSettings(): void {
    decode(Settings)(this.settings)
      .pipe(
        catchError((error) => {
          console.error(String(error));
          this.toastService.error(
            "Please check the contents of the settings.js file (see Console output for more details).",
            "Invalid Settings",
          );
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
