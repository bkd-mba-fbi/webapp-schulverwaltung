import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'erz-my-profile-address',
  templateUrl: './my-profile-address.component.html',
  styleUrls: ['./my-profile-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileAddressComponent {
  @Input() address: string;

  constructor() {}
}
