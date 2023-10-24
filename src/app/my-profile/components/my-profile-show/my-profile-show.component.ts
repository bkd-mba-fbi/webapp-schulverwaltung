import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MyProfileService } from '../../services/my-profile.service';

@Component({
  selector: 'erz-my-profile-show',
  templateUrl: './my-profile-show.component.html',
  styleUrls: ['./my-profile-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileShowComponent {
  constructor(public profileService: MyProfileService) {}
}
