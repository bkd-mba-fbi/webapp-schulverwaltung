import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../../shared/models/person.model';

@Component({
  selector: 'erz-my-profile-header',
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.scss'],
})
export class MyProfileHeaderComponent implements OnInit {
  @Input() student?: Person;

  constructor() {}

  ngOnInit(): void {}
}
