import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";
import { SETTINGS, Settings } from "./settings";
import { I18nService } from "./shared/services/i18n.service";
import { ToastService } from "./shared/services/toast.service";
import { NAVIGATOR } from "./shared/tokens/dom-apis";
import { decode } from "./shared/utils/decode";

@Component({
  selector: "erz-app",
  template:
    '<erz-toast aria-live="polite" aria-atomic="true"></erz-toast><router-outlet></router-outlet>',
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    i18n: I18nService,
    private toastService: ToastService,
    @Inject(SETTINGS) private settings: Settings,
    @Inject(NAVIGATOR) private navigator: Navigator,
  ) {
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
