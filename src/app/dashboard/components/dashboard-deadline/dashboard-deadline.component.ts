import { Component, Input } from "@angular/core";
import { TranslatePipe } from "@ngx-translate/core";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";

@Component({
  selector: "bkd-dashboard-deadline",
  templateUrl: "./dashboard-deadline.component.html",
  styleUrls: ["./dashboard-deadline.component.scss"],
  imports: [TranslatePipe, AddSpacePipe],
})
export class DashboardDeadlineComponent {
  @Input() count: number;

  constructor() {}
}
