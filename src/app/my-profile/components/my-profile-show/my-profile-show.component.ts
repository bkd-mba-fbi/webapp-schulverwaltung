import { Component, OnInit } from '@angular/core';
import { MyProfileService } from '../../services/my-profile.service';

@Component({
  selector: 'erz-my-profile-show',
  templateUrl: './my-profile-show.component.html',
  styleUrls: ['./my-profile-show.component.scss'],
})
export class MyProfileShowComponent implements OnInit {
  constructor(public profileService: MyProfileService) {}

  ngOnInit(): void {}
}
