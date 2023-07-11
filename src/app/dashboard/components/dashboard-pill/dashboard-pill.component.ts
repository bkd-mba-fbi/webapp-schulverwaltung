import { Component, Input } from '@angular/core';

@Component({
  selector: 'erz-dashboard-pill',
  templateUrl: './dashboard-pill.component.html',
  styleUrls: ['./dashboard-pill.component.scss'],
})
export class DashboardPillComponent {
  @Input() count: number;

  constructor() {}
}
