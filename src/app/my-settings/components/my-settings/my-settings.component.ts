import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MySettingsService } from '../../services/my-settings.service';

@Component({
  selector: 'erz-my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MySettingsService],
})
export class MySettingsComponent {
  constructor() {}
}
