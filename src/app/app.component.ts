import { Component, ChangeDetectionStrategy } from '@angular/core';
import { I18nService } from './shared/i18n.service';

@Component({
  selector: 'erz-app',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(i18n: I18nService) {
    i18n.initialize();
  }
}
