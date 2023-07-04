import { Component, Input } from '@angular/core';

@Component({
  selector: 'erz-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
  @Input() title: string;
  @Input() path: string;
  constructor() {}
}
