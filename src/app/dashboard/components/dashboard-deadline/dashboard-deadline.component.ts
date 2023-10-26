import { Component, Input } from "@angular/core";

@Component({
  selector: "erz-dashboard-deadline",
  templateUrl: "./dashboard-deadline.component.html",
  styleUrls: ["./dashboard-deadline.component.scss"],
})
export class DashboardDeadlineComponent {
  @Input() count: number;

  constructor() {}
}
