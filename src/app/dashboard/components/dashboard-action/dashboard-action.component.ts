import { Component, Input } from '@angular/core';
import { Params } from '@angular/router';

@Component({
  selector: 'erz-dashboard-action',
  templateUrl: './dashboard-action.component.html',
  styleUrls: ['./dashboard-action.component.scss'],
})
export class DashboardActionComponent {
  @Input() label: string;
  @Input() count?: number;
  @Input() link?: string[];
  @Input() linkParams?: Params;
  @Input() externalLink?: string;
  constructor() {}
}
