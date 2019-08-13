import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { SETTINGS, Settings } from './settings';
import { I18nService } from './shared/services/i18n.service';
import { decode } from './shared/utils/decode';

@Component({
  selector: 'erz-app',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    i18n: I18nService,
    private toastrService: ToastrService,
    @Inject(SETTINGS) private settings: Settings
  ) {
    i18n.initialize();
    this.checkSettings();
  }

  private checkSettings(): void {
    decode(Settings)(this.settings)
      .pipe(
        catchError(error => {
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
