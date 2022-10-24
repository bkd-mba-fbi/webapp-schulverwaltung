import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'erz-my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MySettingsComponent {
  constructor() {}
}
