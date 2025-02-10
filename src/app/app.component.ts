import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { EMPTY } from "rxjs";
import { catchError } from "rxjs/operators";
import { SETTINGS, Settings } from "./settings";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { I18nService } from "./shared/services/i18n.service";
import { ToastService } from "./shared/services/toast.service";
import { NAVIGATOR } from "./shared/tokens/dom-apis";
import { decode } from "./shared/utils/decode";

@Component({
  selector: "bkd-app",
  template:
    '<bkd-toast aria-live="polite" aria-atomic="true"></bkd-toast><router-outlet></router-outlet>',
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastComponent, RouterOutlet],
})
export class AppComponent {
  private toastService = inject(ToastService);
  private settings = inject<Settings>(SETTINGS);
  private navigator = inject<Navigator>(NAVIGATOR);

  constructor() {
    const i18n = inject(I18nService);

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
