import { Component, OnInit } from '@angular/core';
import { MyProfileService } from '../../services/my-profile.service';

@Component({
  selector: 'erz-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  providers: [MyProfileService],
})
export class MyProfileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
