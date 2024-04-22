import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { AddSpacePipe } from "../../../shared/pipes/add-space.pipe";

@Component({
  selector: "bkd-dashboard-deadline",
  templateUrl: "./dashboard-deadline.component.html",
  styleUrls: ["./dashboard-deadline.component.scss"],
  standalone: true,
  imports: [TranslateModule, AddSpacePipe],
})
export class DashboardDeadlineComponent {
  @Input() count: number;

  constructor() {}
}
