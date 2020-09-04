import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'erz-my-profile-address',
  templateUrl: './my-profile-address.component.html',
  styleUrls: ['./my-profile-address.component.scss'],
})
export class MyProfileAddressComponent implements OnInit {
  @Input() address: string;

  constructor() {}

  ngOnInit(): void {}
}
