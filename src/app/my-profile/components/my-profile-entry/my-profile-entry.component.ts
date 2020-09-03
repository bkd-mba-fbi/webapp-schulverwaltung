import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'erz-my-profile-entry',
  templateUrl: './my-profile-entry.component.html',
  styleUrls: ['./my-profile-entry.component.scss'],
})
export class MyProfileEntryComponent implements OnInit {
  @Input() label: string;
  @Input() value: Option<string | Date>;

  constructor() {}

  ngOnInit(): void {}
}
