import { Component, OnInit } from '@angular/core';
import { StudentProfileService } from '../../../shared/services/student-profile.service';

@Component({
  selector: 'erz-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  profile$ = this.profileService.getMyProfile();

  constructor(public profileService: StudentProfileService) {}

  ngOnInit(): void {}
}
