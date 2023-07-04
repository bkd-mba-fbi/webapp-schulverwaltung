import { Component, Input } from '@angular/core';
import { Params } from '@angular/router';

@Component({
  selector: 'erz-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
  @Input() title: string;
  @Input() count?: number;
  @Input() link?: string[];
  @Input() linkParams?: Params;
  @Input() externalLink?: string;
  constructor() {}
}
