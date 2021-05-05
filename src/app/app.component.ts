import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  HostBinding,
  Injector,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { SETTINGS, Settings } from './settings';
import { I18nService } from './shared/services/i18n.service';
import { decode } from './shared/utils/decode';
import { NAVIGATOR } from './shared/tokens/dom-apis';
import { MyNotificationsService } from './my-notifications/services/my-notifications.service';
import { createCustomElement } from '@angular/elements';
import { MyNotificationsShowComponent } from './my-notifications/components/my-notifications-show/my-notifications-show.component';

@Component({
  selector: 'erz-app',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    i18n: I18nService,
    private toastrService: ToastrService,
    @Inject(SETTINGS) private settings: Settings,
    @Inject(NAVIGATOR) private navigator: Navigator,
    injector: Injector,
    private notificationService: MyNotificationsService
  ) {
    i18n.initialize();
    this.checkSettings();
    const notificationsElement = createCustomElement(
      MyNotificationsShowComponent,
      { injector }
    );
    customElements.define('erz-notifications', notificationsElement);
  }

  private checkSettings(): void {
    decode(Settings)(this.settings)
      .pipe(
        catchError((error) => {
          console.error(String(error));
          this.toastrService.error(
            'Please check the contents of the settings.js file (see Console output for more details).',
            'Invalid Settings'
          );
          return EMPTY;
        })
      )
      .subscribe();
  }
}
